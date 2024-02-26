"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { musicData } from '../moods/musicData';
import { useEffect, useState } from 'react';

interface GraphProps {
  emotion: string;
}

const Graph: React.FC<GraphProps> = ({ emotion }) => {
    const [data, setData] = useState<{ id: string; title: string; url: string; views: number; language: string; addedDate: Date }[]>([]);

  // Mettre à jour les données lorsqu'une nouvelle émotion est sélectionnée
  useEffect(() => {
    setData(musicData[emotion as keyof typeof musicData] || []);
  }, [emotion]);

  return (
    <>
      <div className="w-full mt-20 bg-gray-200 rounded overflow-hidden">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="addedDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        Ci-dessus, un graphique montrant la fréquence de visibilité des vidéos par émotions.
      </div>
    </>
  );
};

export default Graph;
