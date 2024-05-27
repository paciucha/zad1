import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Data {
  title: string;
  text: string;
  image: string;
}

interface Props {
  data: Data;
}

const Page = ({ data }: Props) => {
  const router = useRouter();
  const { id } = router.query;

  const generatePDF = () => {
    const input = document.getElementById('content')!;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${id}.pdf`);
    });
  };

  return (
    <div id="content" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>{data.title}</h1>
      <p>{data.text}</p>
      <img src={data.image} alt={data.title} style={{ width: '100%', height: 'auto' }} />
      <button onClick={generatePDF} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
        Pobierz PDF
      </button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const filePath = path.join(process.cwd(), 'src', 'data', 'data.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(jsonData)[id as string];

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
    },
  };
};

export default Page;