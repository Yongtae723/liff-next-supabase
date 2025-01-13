const HomeComponent: React.FC<{ displayName: string }> = ({ displayName }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-lg font-medium">Hi {displayName}</span>
    </div>
  );
};

export default HomeComponent;
