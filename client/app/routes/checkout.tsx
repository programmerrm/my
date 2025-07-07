import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "checkout" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Checkout() {
  return (
    <section>
      <h2>checkout</h2>
    </section>
  );
}
