import jsPDF from "jspdf";
import Webcam from "react-webcam";
import { useRef, useState } from "react";
import axios from "axios";

export default function Detect() {
  const webcamRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];

    if (!droppedFile) return;

    if (!droppedFile.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setFile(droppedFile);
    setPreview(URL.createObjectURL(droppedFile));
    setResult(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) return;

    setPreview(imageSrc);
    setResult(null);

    const response = await fetch(imageSrc);
    const blob = await response.blob();

    const capturedFile = new File(
      [blob],
      "camera_capture.jpg",
      { type: "image/jpeg" }
    );

    setFile(capturedFile);
    setCameraOpen(false);
  };

  const handleRescan = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setCameraOpen(false);

    const fileInput = document.getElementById("fileInput");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handlePredict = async () => {
    if (!file) {
      alert("Please select or capture an image first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://dental-disease-detection-system.onrender.com/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result || !preview) {
      alert("No report available.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Dental Disease Detection Report", 20, 20);

    doc.setFontSize(12);
    doc.text(
      `Generated On: ${new Date().toLocaleString()}`,
      20,
      30
    );

    doc.text("Input Image:", 20, 45);

    try {
      doc.addImage(preview, "JPEG", 20, 50, 60, 60);
    } catch (error) {
      console.log("Image could not be added to PDF.");
    }

    let y = 125;

    doc.text(`Status: ${result.status}`, 20, y);
    y += 10;

    doc.text(`Disease: ${result.disease}`, 20, y);
    y += 10;

    doc.text(
      `Confidence: ${result.confidence}%`,
      20,
      y
    );

    y += 15;

    if (result.info) {
      doc.text(
        `Description: ${result.info.description}`,
        20,
        y,
        { maxWidth: 170 }
      );

      y += 20;

      doc.text("Symptoms:", 20, y);
      y += 10;

      result.info.symptoms.forEach((symptom) => {
        doc.text(`• ${symptom}`, 25, y);
        y += 8;
      });

      y += 5;

      doc.text("Prevention:", 20, y);
      y += 10;

      result.info.prevention.forEach((item) => {
        doc.text(`• ${item}`, 25, y);
        y += 8;
      });
    }

    y += 15;

    doc.text("Recommendation:", 20, y);
    y += 8;

    doc.text(
      "This AI-generated report is intended for educational purposes only and should not replace professional dental diagnosis.",
      20,
      y,
      { maxWidth: 170 }
    );

    doc.save(
      `Dental_Report_${result.disease}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-5xl font-bold text-center mb-12">
        Disease Detection
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* Upload Card */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">

          <h2 className="text-2xl font-bold mb-6">
            Upload Dental Image
          </h2>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-cyan-500 rounded-2xl p-10 text-center mb-6"
          >
            <p className="text-slate-300 mb-4">
              Drag & Drop Dental Images Here
            </p>

            <p className="text-slate-500 mb-4">
              OR
            </p>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-wrap justify-center gap-4">

              <button
                type="button"
                onClick={() =>
                  document.getElementById("fileInput").click()
                }
                className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
              >
                Choose File
              </button>

              <button
                type="button"
                onClick={() => setCameraOpen(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
              >
                Open Camera
              </button>

            </div>

            {file && (
              <p className="mt-4 text-cyan-300">
                Selected: {file.name}
              </p>
            )}
          </div>

          {cameraOpen && (
            <div className="mb-6">

              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-2xl w-full mb-4"
              />

              <div className="flex justify-center gap-4">

                <button
                  onClick={captureImage}
                  className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Capture
                </button>

                <button
                  onClick={() => setCameraOpen(false)}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Close Camera
                </button>

              </div>

            </div>
          )}

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="rounded-2xl w-full max-h-96 object-cover mb-6"
            />
          )}

          <div className="flex gap-4 mt-4">

            <button
              onClick={handlePredict}
              disabled={loading}
              className="bg-cyan-500 text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Detect Disease"}
            </button>

            {(preview || result) && (
              <button
                onClick={handleRescan}
                className="bg-red-500 text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition"
              >
                Rescan
              </button>
            )}

          </div>

        </div>

        {/* Result Card */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">

          <h2 className="text-2xl font-bold mb-6">
            Prediction Result
          </h2>

          {!result ? (
            <p className="text-slate-400">
              Upload an image to see results.
            </p>
          ) : (
            <div className="space-y-4">

              <p>
                <strong>Status:</strong> {result.status}
              </p>

              <p>
                <strong>Disease:</strong> {result.disease}
              </p>

              <p>
                <strong>Confidence:</strong> {result.confidence}%
              </p>

              {result.info && (
                <>
                  <p>
                    <strong>Description:</strong>{" "}
                    {result.info.description}
                  </p>

                  <div>
                    <strong>Symptoms:</strong>

                    <ul className="list-disc ml-6">
                      {result.info.symptoms.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong>Prevention:</strong>

                    <ul className="list-disc ml-6">
                      {result.info.prevention.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <button
                onClick={downloadReport}
                className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
              >
                Download PDF Report
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
