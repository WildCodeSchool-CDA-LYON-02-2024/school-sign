// next
// components
// ui

import SignatureCanvas from "@/components/SignatureCanvas";

export default function StudentDashboard() {
  return (
    <>
      <div className="flex flex-col justify-center items-center py-8">
        <h1>Student Dashboard</h1>
        <div className="flex flex-col justify-center items-center mt-20">
          <SignatureCanvas />
        </div>
      </div>
    </>
  );
}
