"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";

export default function SignatureCanvas() {
  const [dataURL, setDataURL] = useState<string | null>(null);
  const [canvasKey, setCanvasKey] = useState<number>(0); // Key to force re-render
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  // Effect to initialize SignaturePad when canvasKey changes
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Clean up the previous SignaturePad instance
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }

      // Initialize the new SignaturePad instance
      const signaturePad = new SignaturePad(canvas);
      signaturePadRef.current = signaturePad;
    }
  }, [canvasKey]);

  const saveAsPNG = async () => {
    if (signaturePadRef.current) {
      try {
        const dataUrl = signaturePadRef.current.toDataURL();
        setDataURL(dataUrl);
        await uploadSignature(dataUrl); // Upload the signature to the server
      } catch (error) {
        console.error("Error generating PNG data URL", error);
      }
    }
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setDataURL(null);
    }
  };

  const restartSignature = () => {
    // Force re-render by changing the key
    setCanvasKey(prevKey => prevKey + 1);
    setDataURL(null);
  };

  const uploadSignature = async (dataUrl: string) => {
    try {
      const response = await fetch("/api/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload signature");
      }

      console.log("Signature uploaded successfully");
    } catch (error) {
      console.error("Error uploading signature", error);
    }
  };

  return (
    <div>
      {!dataURL ? (
        <div className="flex flex-col items-center">
          <div
            className="relative border-4 border-gray-600"
            style={{ width: "300px", height: "150px" }} // Adjust size as needed
          >
            <canvas
              ref={canvasRef}
              key={canvasKey} // Unique key to force re-render
              style={{ width: "100%", height: "100%" }}
              aria-label="Signature Canvas"
            ></canvas>
          </div>
          <div className="mt-4">
            <button
              onClick={saveAsPNG}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
              aria-label="Save Signature as PNG"
            >
              Save as PNG
            </button>
            <button
              onClick={clearSignature}
              className="px-4 py-2 bg-red-500 text-white rounded"
              aria-label="Clear Signature"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h4 className="mb-4">Saved Signature</h4>
          <img src={dataURL} alt="Signature" style={{ maxWidth: "100%", height: "auto" }} />
          <button
            onClick={restartSignature}
            className="px-4 py-2 bg-green-500 text-white rounded mt-4"
            aria-label="Restart Signature"
          >
            Restart Signature
          </button>
        </div>
      )}
    </div>
  );
}
