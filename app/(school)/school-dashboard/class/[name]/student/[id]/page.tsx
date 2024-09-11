"use client";

export default function StudentById({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="flex items-center justify-center h-screen flex-col gap-4 p-4 md:p-36">
        <h1>
          Ajouter les informations d&apos;un student via son ID: {params.id}
        </h1>
      </div>
    </div>
  );
}
