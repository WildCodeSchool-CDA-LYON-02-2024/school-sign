"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { useSignatureContext } from "../components/context/SignatureContext";
import Image from "next/image";

export default function SignatureCanvas() {
  const [dataURL, setDataURL] = useState<string | null>(null);
  const [canvasKey, setCanvasKey] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const { addStudentSignature, clearStudentSignatures } = useSignatureContext(); // Utilisation du contexte
  console.log(dataURL);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }

      const signaturePad = new SignaturePad(canvas);
      signaturePadRef.current = signaturePad;
    }
  }, [canvasKey]);

  const saveAsPNG = () => {
    if (signaturePadRef.current) {
      const dataUrl = signaturePadRef.current.toDataURL();
      console.log(dataUrl);

      setDataURL(dataUrl);
      addStudentSignature(dataUrl);
    }
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setDataURL(null);
      clearStudentSignatures();
    }
  };

  const restartSignature = () => {
    setCanvasKey((prevKey) => prevKey + 1);
    setDataURL(null);
  };

  return (
    <div>
      {!dataURL ? (
        <div className="flex flex-col items-center">
          <div
            className="relative border-4 border-gray-600"
            style={{ width: "300px", height: "150px" }}
          >
            <canvas
              ref={canvasRef}
              key={canvasKey}
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
          <Image src={dataURL} alt="Signature" width={600} height={500}></Image>

          {/* <img src={dataURL} alt="Signature" style={{ maxWidth: "100%", height: "auto" }} /> */}
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
