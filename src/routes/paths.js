export const PATHS = {
  home: "/",
  products: "/products",
  process: "/process",
  contact: "/contact",
  about: "/#about",
  cart: "/cart",
  profile: "/profile",
  order: "/order",
  wishlist: "/wishlist",
  signIn: "/sign-in",
  signup: "/signup",
  testimonials: "/testimonials",
};

export function productPath(id) {
  return `/products/${id}`;
}

export function productCategoryPath(categoryId) {
  return `/products/category/${categoryId}`;
}

export const FOOTER_LINKS = [
  { label: "About", to: PATHS.about },
  { label: "Products", to: PATHS.products },
  { label: "Process", to: PATHS.process },
  { label: "Contact", to: PATHS.contact },
];
