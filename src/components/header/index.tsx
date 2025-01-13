import Image from "next/image";

const HeaderComponent: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={imageUrl}
        alt="profile"
        width={48}
        height={48}
        className="rounded-full object-cover"
      />
      <span className="text-lg font-medium">This is a header</span>
    </div>
  );
};

export default HeaderComponent;
