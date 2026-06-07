import * as path from "node:path"
import { fileURLToPath } from "node:url"
import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as acm from "aws-cdk-lib/aws-certificatemanager"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as origins from "aws-cdk-lib/aws-cloudfront-origins"
import * as ec2 from "aws-cdk-lib/aws-ec2"
import * as ecs from "aws-cdk-lib/aws-ecs"
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns"
import * as ecrAssets from "aws-cdk-lib/aws-ecr-assets"
import * as elasticache from "aws-cdk-lib/aws-elasticache"
import * as iam from "aws-cdk-lib/aws-iam"
import * as logs from "aws-cdk-lib/aws-logs"
import * as rds from "aws-cdk-lib/aws-rds"
import * as s3 from "aws-cdk-lib/aws-s3"
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "../../..")

export class HaloLeafStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const projectName = this.node.tryGetContext("projectName") || "halo-leaf"
    const frontendDomainName = this.node.tryGetContext("frontendDomainName") || ""
    const certificateArn = this.node.tryGetContext("certificateArn") || ""

    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 1,
    })

    const dbCredentials = new rds.DatabaseSecret(this, "DatabaseCredentials", {
      username: "medusa",
    })

    const database = new rds.DatabaseInstance(this, "Postgres", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_3,
      }),
      credentials: rds.Credentials.fromSecret(dbCredentials),
      databaseName: "medusa",
      vpc,
      allocatedStorage: 50,
      backupRetention: cdk.Duration.days(7),
      deletionProtection: true,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    })

    const redisSecurityGroup = new ec2.SecurityGroup(this, "RedisSecurityGroup", {
      vpc,
      allowAllOutbound: true,
    })

    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, "RedisSubnetGroup", {
      description: `${projectName} redis subnet group`,
      subnetIds: vpc.privateSubnets.map((subnet) => subnet.subnetId),
    })

    const redis = new elasticache.CfnCacheCluster(this, "Redis", {
      engine: "redis",
      cacheNodeType: "cache.t4g.micro",
      numCacheNodes: 1,
      vpcSecurityGroupIds: [redisSecurityGroup.securityGroupId],
      cacheSubnetGroupName: redisSubnetGroup.ref,
    })

    const appSecrets = new secretsmanager.Secret(this, "MedusaAppSecrets", {
      secretName: `${projectName}/medusa/app`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          JWT_SECRET: "replace-after-deploy",
          COOKIE_SECRET: "replace-after-deploy",
          DATABASE_URL: "postgres://medusa:password@replace-rds-endpoint:5432/medusa",
          RAZORPAY_ID: "",
          RAZORPAY_SECRET: "",
          RAZORPAY_ACCOUNT: "",
          RAZORPAY_WEBHOOK_SECRET: "",
          SHIPROCKET_EMAIL: "",
          SHIPROCKET_PASSWORD: "",
          SHIPROCKET_PICKUP_LOCATION: "Primary",
          SHIPROCKET_WEBHOOK_SECRET: "",
          RAPIDSHYP_TOKEN: "",
        }),
        generateStringKey: "GENERATED_PLACEHOLDER",
      },
    })

    const cluster = new ecs.Cluster(this, "Cluster", { vpc })
    const backendImage = new ecrAssets.DockerImageAsset(this, "BackendImage", {
      directory: path.join(repoRoot, "backend"),
    })

    const backend = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "BackendService",
      {
        cluster,
        desiredCount: 2,
        cpu: 1024,
        memoryLimitMiB: 2048,
        publicLoadBalancer: true,
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(backendImage),
          containerPort: 9000,
          logDriver: ecs.LogDrivers.awsLogs({
            streamPrefix: projectName,
            logRetention: logs.RetentionDays.ONE_MONTH,
          }),
          environment: {
            NODE_ENV: "production",
            PORT: "9000",
            REDIS_URL: `redis://${redis.attrRedisEndpointAddress}:6379`,
            STORE_CORS: frontendDomainName ? `https://${frontendDomainName}` : "*",
            ADMIN_CORS: frontendDomainName ? `https://${frontendDomainName}` : "*",
            AUTH_CORS: frontendDomainName ? `https://${frontendDomainName}` : "*",
            DEFAULT_PICKUP_PINCODE: "226202",
          },
          secrets: {
            JWT_SECRET: ecs.Secret.fromSecretsManager(appSecrets, "JWT_SECRET"),
            COOKIE_SECRET: ecs.Secret.fromSecretsManager(appSecrets, "COOKIE_SECRET"),
            DATABASE_URL: ecs.Secret.fromSecretsManager(appSecrets, "DATABASE_URL"),
            RAZORPAY_ID: ecs.Secret.fromSecretsManager(appSecrets, "RAZORPAY_ID"),
            RAZORPAY_SECRET: ecs.Secret.fromSecretsManager(appSecrets, "RAZORPAY_SECRET"),
            RAZORPAY_ACCOUNT: ecs.Secret.fromSecretsManager(appSecrets, "RAZORPAY_ACCOUNT"),
            RAZORPAY_WEBHOOK_SECRET: ecs.Secret.fromSecretsManager(appSecrets, "RAZORPAY_WEBHOOK_SECRET"),
            SHIPROCKET_EMAIL: ecs.Secret.fromSecretsManager(appSecrets, "SHIPROCKET_EMAIL"),
            SHIPROCKET_PASSWORD: ecs.Secret.fromSecretsManager(appSecrets, "SHIPROCKET_PASSWORD"),
            SHIPROCKET_PICKUP_LOCATION: ecs.Secret.fromSecretsManager(
              appSecrets,
              "SHIPROCKET_PICKUP_LOCATION"
            ),
            SHIPROCKET_WEBHOOK_SECRET: ecs.Secret.fromSecretsManager(
              appSecrets,
              "SHIPROCKET_WEBHOOK_SECRET"
            ),
            RAPIDSHYP_TOKEN: ecs.Secret.fromSecretsManager(appSecrets, "RAPIDSHYP_TOKEN"),
          },
        },
      }
    )

    database.connections.allowFrom(backend.service, ec2.Port.tcp(5432))
    redisSecurityGroup.addIngressRule(
      backend.service.connections.securityGroups[0],
      ec2.Port.tcp(6379),
      "Allow backend to reach Redis"
    )
    appSecrets.grantRead(backend.taskDefinition.taskRole)
    backend.taskDefinition.taskRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [appSecrets.secretArn, dbCredentials.secretArn],
      })
    )

    const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    const distribution = new cloudfront.Distribution(this, "FrontendDistribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      domainNames: frontendDomainName ? [frontendDomainName] : undefined,
      certificate:
        certificateArn && frontendDomainName
          ? acm.Certificate.fromCertificateArn(this, "Certificate", certificateArn)
          : undefined,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    })

    new cdk.CfnOutput(this, "BackendUrl", {
      value: `http://${backend.loadBalancer.loadBalancerDnsName}`,
    })
    new cdk.CfnOutput(this, "FrontendBucketName", { value: frontendBucket.bucketName })
    new cdk.CfnOutput(this, "FrontendDistributionId", {
      value: distribution.distributionId,
    })
    new cdk.CfnOutput(this, "FrontendUrl", {
      value: `https://${distribution.distributionDomainName}`,
    })
  }
}
