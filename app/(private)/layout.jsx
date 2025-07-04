import Navbar from "./_components/navbar";

export default function PrivateLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
