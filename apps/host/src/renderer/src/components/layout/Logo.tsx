import LogoImage from "@/assets/img/logo.svg";

export default function Logo() {
  return (
    <h1 className="h-6">
      <img src={LogoImage} alt="Logo" className="h-full w-auto" />
    </h1>
  );
}
