interface ClassHeaderProps {
  className: string | null;
  classId: number | null;
}

export default function ClassComponent({
  className,
  classId,
}: ClassHeaderProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        {className ? `Class : ${className}` : "Unknown class"}
      </h2>
    </>
  );
}
