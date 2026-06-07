#!/usr/bin/env node
import * as cdk from "aws-cdk-lib"
import { HaloLeafStack } from "../lib/halo-leaf-stack.js"

const app = new cdk.App()

new HaloLeafStack(app, "HaloLeafProductionStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "ap-south-1",
  },
})
