import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Papa from "papaparse";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0]));
          setData(results.data);
          toast.success("File uploaded successfully!");
        },
        error: () => {
          toast.error("Failed to parse the file.");
        },
      });
    }
  };

  const handleCellChange = (rowIndex, columnKey, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][columnKey] = value;
    setData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (rowIndex) => {
    const updatedData = data.filter((_, index) => index !== rowIndex);
    setData(updatedData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">CSV Upload, Edit, and Download Tool</h1>
      <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      {data.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      <Input
                        value={row[header]}
                        onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex space-x-2">
            <Button onClick={handleAddRow}>Add Row</Button>
            <Button onClick={handleDownload}>Download CSV</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;