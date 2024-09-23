interface ClassHeaderProps {
  className: string | null;
  classId: number | null;
}

export default function ClassHeader({ className, classId }: ClassHeaderProps) {
  return (
    <>
      <h1 className="text-center text-2xl pb-8">Teacher Class</h1>
      {classId ? (
        <div className="flex flex-col justify-center items-center container mx-auto py-10 gap-y-10">
          <h2 className="text-2xl mb-4">
            {className ? `Class : ${className}` : "Unknown class"}
          </h2>
        </div>
      ) : (
        <p>No class is assigned to you.</p>
      )}
    </>
  );
}
