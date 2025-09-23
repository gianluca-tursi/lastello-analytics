'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp } from 'lucide-react';
import { useState } from 'react';

// Dati per tutte le province italiane (2020-2025)
const provinceData = [
  { provincia: "Agrigento", "2020": 5304, "2021": 5883, "2022": 5325, "2023": 5179, "2024": 4803, "2025": 4656 },
  { provincia: "Alessandria", "2020": 7814, "2021": 6141, "2022": 6662, "2023": 6028, "2024": 5860, "2025": 5834 },
  { provincia: "Ancona", "2020": 6017, "2021": 6287, "2022": 5970, "2023": 5441, "2024": 5313, "2025": 5310 },
  { provincia: "Aosta", "2020": 1849, "2021": 1533, "2022": 1531, "2023": 1369, "2024": 1426, "2025": 1334 },
  { provincia: "Arezzo", "2020": 4429, "2021": 4537, "2022": 4504, "2023": 4129, "2024": 4076, "2025": 4090 },
  { provincia: "Ascoli Piceno", "2020": 2648, "2021": 2679, "2022": 2764, "2023": 2428, "2024": 2443, "2025": 2378 },
  { provincia: "Asti", "2020": 3690, "2021": 3146, "2022": 3172, "2023": 2804, "2024": 2682, "2025": 2722 },
  { provincia: "Avellino", "2020": 5384, "2021": 5318, "2022": 5192, "2023": 4775, "2024": 4649, "2025": 4896 },
  { provincia: "Bari", "2020": 13193, "2021": 14454, "2022": 13051, "2023": 12690, "2024": 12298, "2025": 12680 },
  { provincia: "Barletta-Andria-Trani", "2020": 4035, "2021": 3911, "2022": 3670, "2023": 3591, "2024": 3444, "2025": 3640 },
  { provincia: "Belluno", "2020": 2947, "2021": 2664, "2022": 2824, "2023": 2487, "2024": 2558, "2025": 2568 },
  { provincia: "Benevento", "2020": 3487, "2021": 3588, "2022": 3505, "2023": 3305, "2024": 3269, "2025": 3298 },
  { provincia: "Bergamo", "2020": 16368, "2021": 10395, "2022": 11641, "2023": 10770, "2024": 10641, "2025": 11028 },
  { provincia: "Biella", "2020": 3136, "2021": 2569, "2022": 2678, "2023": 2459, "2024": 2476, "2025": 2472 },
  { provincia: "Bologna", "2020": 13330, "2021": 12895, "2022": 12614, "2023": 11780, "2024": 11687, "2025": 11658 },
  { provincia: "Bolzano/Bozen", "2020": 5458, "2021": 5053, "2022": 5222, "2023": 4551, "2024": 4549, "2025": 4684 },
  { provincia: "Brescia", "2020": 16608, "2021": 13358, "2022": 12935, "2023": 12025, "2024": 11992, "2025": 12146 },
  { provincia: "Brindisi", "2020": 4469, "2021": 4495, "2022": 4663, "2023": 4602, "2024": 4295, "2025": 4406 },
  { provincia: "Cagliari", "2020": 4176, "2021": 4079, "2022": 4811, "2023": 4331, "2024": 4274, "2025": 4420 },
  { provincia: "Caltanissetta", "2020": 3055, "2021": 3478, "2022": 3174, "2023": 2904, "2024": 2791, "2025": 2736 },
  { provincia: "Campobasso", "2020": 2907, "2021": 3205, "2022": 3040, "2023": 2774, "2024": 2772, "2025": 2632 },
  { provincia: "Caserta", "2020": 8917, "2021": 9120, "2022": 9161, "2023": 8931, "2024": 8669, "2025": 8588 },
  { provincia: "Catania", "2020": 11541, "2021": 12302, "2022": 12029, "2023": 11312, "2024": 10717, "2025": 10988 },
  { provincia: "Catanzaro", "2020": 3800, "2021": 4099, "2022": 4158, "2023": 3870, "2024": 3809, "2025": 3918 },
  { provincia: "Chieti", "2020": 4857, "2021": 5078, "2022": 5029, "2023": 4927, "2024": 4450, "2025": 4456 },
  { provincia: "Como", "2020": 7928, "2021": 6796, "2022": 6828, "2023": 6144, "2024": 6175, "2025": 6316 },
  { provincia: "Cosenza", "2020": 7950, "2021": 8664, "2022": 8366, "2023": 8100, "2024": 7772, "2025": 7702 },
  { provincia: "Cremona", "2020": 6284, "2021": 4209, "2022": 4406, "2023": 4109, "2024": 4168, "2025": 4272 },
  { provincia: "Crotone", "2020": 1846, "2021": 1907, "2022": 1946, "2023": 1774, "2024": 1710, "2025": 1716 },
  { provincia: "Cuneo", "2020": 8595, "2021": 7498, "2022": 7596, "2023": 6931, "2024": 6820, "2025": 6872 },
  { provincia: "Enna", "2020": 2220, "2021": 2291, "2022": 2228, "2023": 2019, "2024": 1769, "2025": 1844 },
  { provincia: "Fermo", "2020": 2245, "2021": 2357, "2022": 2203, "2023": 2100, "2024": 2045, "2025": 1976 },
  { provincia: "Ferrara", "2020": 5266, "2021": 5358, "2022": 5241, "2023": 4655, "2024": 4728, "2025": 4488 },
  { provincia: "Firenze", "2020": 12717, "2021": 12103, "2022": 12888, "2023": 11209, "2024": 11600, "2025": 11246 },
  { provincia: "Foggia", "2020": 7631, "2021": 7519, "2022": 6885, "2023": 6488, "2024": 6425, "2025": 6450 },
  { provincia: "Forlì-Cesena", "2020": 4933, "2021": 5161, "2022": 4880, "2023": 4464, "2024": 4367, "2025": 4408 },
  { provincia: "Frosinone", "2020": 5953, "2021": 6361, "2022": 6044, "2023": 5756, "2024": 5438, "2025": 5650 },
  { provincia: "Genova", "2020": 14501, "2021": 12143, "2022": 12922, "2023": 11520, "2024": 11394, "2025": 11252 },
  { provincia: "Gorizia", "2020": 1971, "2021": 1972, "2022": 1949, "2023": 1777, "2024": 1671, "2025": 1710 },
  { provincia: "Grosseto", "2020": 3059, "2021": 2939, "2022": 3154, "2023": 2929, "2024": 3026, "2025": 2760 },
  { provincia: "Imperia", "2020": 3408, "2021": 3212, "2022": 3397, "2023": 3042, "2024": 2900, "2025": 3008 },
  { provincia: "Isernia", "2020": 1220, "2021": 1260, "2022": 1241, "2023": 1123, "2024": 1115, "2025": 1128 },
  { provincia: "L'Aquila", "2020": 3797, "2021": 3825, "2022": 3913, "2023": 3626, "2024": 3375, "2025": 3488 },
  { provincia: "La Spezia", "2020": 3440, "2021": 3159, "2022": 3262, "2023": 2895, "2024": 2893, "2025": 2820 },
  { provincia: "Latina", "2020": 5809, "2021": 5980, "2022": 6215, "2023": 5889, "2024": 5888, "2025": 5756 },
  { provincia: "Lecce", "2020": 9071, "2021": 9785, "2022": 9828, "2023": 9281, "2024": 9215, "2025": 9104 },
  { provincia: "Lecco", "2020": 4590, "2021": 3720, "2022": 3846, "2023": 3454, "2024": 3430, "2025": 3764 },
  { provincia: "Livorno", "2020": 4549, "2021": 4509, "2022": 4849, "2023": 4216, "2024": 4247, "2025": 4170 },
  { provincia: "Lodi", "2020": 3369, "2021": 2413, "2022": 2526, "2023": 2290, "2024": 2305, "2025": 2402 },
  { provincia: "Lucca", "2020": 5183, "2021": 5247, "2022": 5110, "2023": 4812, "2024": 4785, "2025": 4714 },
  { provincia: "Macerata", "2020": 4170, "2021": 4248, "2022": 4229, "2023": 3689, "2024": 3799, "2025": 3656 },
  { provincia: "Mantova", "2020": 5799, "2021": 5127, "2022": 5068, "2023": 4860, "2024": 4709, "2025": 4692 },
  { provincia: "Massa-Carrara", "2020": 3036, "2021": 2696, "2022": 2881, "2023": 2651, "2024": 2484, "2025": 2484 },
  { provincia: "Matera", "2020": 2223, "2021": 2273, "2022": 2324, "2023": 2164, "2024": 2058, "2025": 2212 },
  { provincia: "Messina", "2020": 7644, "2021": 8300, "2022": 8467, "2023": 7666, "2024": 7273, "2025": 7342 },
  { provincia: "Milano", "2020": 41281, "2021": 33730, "2022": 35315, "2023": 32425, "2024": 31756, "2025": 31904 },
  { provincia: "Modena", "2020": 8498, "2021": 8024, "2022": 8113, "2023": 7745, "2024": 7531, "2025": 7608 },
  { provincia: "Monza e della Brianza", "2020": 10433, "2021": 8797, "2022": 9182, "2023": 8490, "2024": 8567, "2025": 8996 },
  { provincia: "Napoli", "2020": 30067, "2021": 31129, "2022": 30860, "2023": 28683, "2024": 28542, "2025": 28912 },
  { provincia: "Novara", "2020": 5209, "2021": 4416, "2022": 4652, "2023": 4118, "2024": 4181, "2025": 4110 },
  { provincia: "Nuoro", "2020": 2612, "2021": 2675, "2022": 2788, "2023": 2437, "2024": 2467, "2025": 2546 },
  { provincia: "Oristano", "2020": 2170, "2021": 2153, "2022": 2256, "2023": 2050, "2024": 2033, "2025": 1998 },
  { provincia: "Padova", "2020": 10131, "2021": 10164, "2022": 10223, "2023": 9513, "2024": 9520, "2025": 9584 },
  { provincia: "Palermo", "2020": 13949, "2021": 14378, "2022": 13967, "2023": 13307, "2024": 12765, "2025": 13226 },
  { provincia: "Parma", "2020": 6694, "2021": 5401, "2022": 5420, "2023": 4958, "2024": 5009, "2025": 5206 },
  { provincia: "Pavia", "2020": 9293, "2021": 7352, "2022": 7641, "2023": 7138, "2024": 7131, "2025": 6992 },
  { provincia: "Perugia", "2020": 7945, "2021": 8497, "2022": 8292, "2023": 7622, "2024": 7594, "2025": 7540 },
  { provincia: "Pesaro e Urbino", "2020": 5043, "2021": 4339, "2022": 4454, "2023": 3961, "2024": 3883, "2025": 3982 },
  { provincia: "Pescara", "2020": 3873, "2021": 4023, "2022": 3968, "2023": 3610, "2024": 3607, "2025": 3610 },
  { provincia: "Piacenza", "2020": 5029, "2021": 3681, "2022": 3728, "2023": 3634, "2024": 3423, "2025": 3484 },
  { provincia: "Pisa", "2020": 5226, "2021": 5102, "2022": 5291, "2023": 4762, "2024": 4745, "2025": 4770 },
  { provincia: "Pistoia", "2020": 3649, "2021": 3926, "2022": 3662, "2023": 3500, "2024": 3456, "2025": 3334 },
  { provincia: "Pordenone", "2020": 3781, "2021": 3763, "2022": 3576, "2023": 3317, "2024": 3329, "2025": 3454 },
  { provincia: "Potenza", "2020": 4616, "2021": 4735, "2022": 4795, "2023": 4416, "2024": 4134, "2025": 4436 },
  { provincia: "Prato", "2020": 2814, "2021": 3040, "2022": 2858, "2023": 2508, "2024": 2607, "2025": 2566 },
  { provincia: "Ragusa", "2020": 3418, "2021": 3457, "2022": 3470, "2023": 3315, "2024": 3071, "2025": 3286 },
  { provincia: "Ravenna", "2020": 5299, "2021": 5283, "2022": 5161, "2023": 4778, "2024": 4698, "2025": 4830 },
  { provincia: "Reggio Calabria", "2020": 6004, "2021": 6604, "2022": 6548, "2023": 6083, "2024": 5785, "2025": 5762 },
  { provincia: "Reggio nell'Emilia", "2020": 6339, "2021": 5869, "2022": 5924, "2023": 5458, "2024": 5399, "2025": 5582 },
  { provincia: "Rieti", "2020": 2082, "2021": 2075, "2022": 2240, "2023": 2011, "2024": 1962, "2025": 1876 },
  { provincia: "Rimini", "2020": 4277, "2021": 3937, "2022": 3880, "2023": 3478, "2024": 3573, "2025": 3472 },
  { provincia: "Roma", "2020": 44352, "2021": 45396, "2022": 44892, "2023": 43441, "2024": 43431, "2025": 42710 },
  { provincia: "Rovigo", "2020": 3381, "2021": 3289, "2022": 3425, "2023": 2918, "2024": 2903, "2025": 2996 },
  { provincia: "Salerno", "2020": 11570, "2021": 12593, "2022": 12566, "2023": 11815, "2024": 11391, "2025": 12000 },
  { provincia: "Sassari", "2020": 5694, "2021": 5417, "2022": 5972, "2023": 5350, "2024": 5352, "2025": 5350 },
  { provincia: "Savona", "2020": 4478, "2021": 4185, "2022": 4311, "2023": 3943, "2024": 3822, "2025": 3814 },
  { provincia: "Siena", "2020": 3473, "2021": 3655, "2022": 3658, "2023": 3241, "2024": 3245, "2025": 3222 },
  { provincia: "Siracusa", "2020": 4589, "2021": 5002, "2022": 4918, "2023": 4445, "2024": 4424, "2025": 4254 },
  { provincia: "Sondrio", "2020": 2609, "2021": 2120, "2022": 2164, "2023": 2019, "2024": 2077, "2025": 1982 },
  { provincia: "Sud Sardegna", "2020": 4342, "2021": 4461, "2022": 4697, "2023": 4395, "2024": 4323, "2025": 4162 },
  { provincia: "Taranto", "2020": 6251, "2021": 7026, "2022": 6510, "2023": 6298, "2024": 6121, "2025": 6082 },
  { provincia: "Teramo", "2020": 3769, "2021": 3731, "2022": 3846, "2023": 3442, "2024": 3377, "2025": 3508 },
  { provincia: "Terni", "2020": 3186, "2021": 3084, "2022": 3314, "2023": 3107, "2024": 2965, "2025": 2998 },
  { provincia: "Torino", "2020": 32064, "2021": 28320, "2022": 29250, "2023": 26643, "2024": 26265, "2025": 26288 },
  { provincia: "Trapani", "2020": 5033, "2021": 5422, "2022": 5586, "2023": 5045, "2024": 5025, "2025": 5028 },
  { provincia: "Trento", "2020": 6626, "2021": 5502, "2022": 5442, "2023": 5150, "2024": 5220, "2025": 5076 },
  { provincia: "Treviso", "2020": 9637, "2021": 9161, "2022": 9250, "2023": 8667, "2024": 8506, "2025": 8858 },
  { provincia: "Trieste", "2020": 3662, "2021": 3668, "2022": 3489, "2023": 3252, "2024": 3343, "2025": 3164 },
  { provincia: "Udine", "2020": 7203, "2021": 7527, "2022": 6861, "2023": 6187, "2024": 6295, "2025": 6304 },
  { provincia: "Varese", "2020": 11687, "2021": 10420, "2022": 10378, "2023": 9520, "2024": 9488, "2025": 9612 },
  { provincia: "Venezia", "2020": 10784, "2021": 10306, "2022": 10538, "2023": 9463, "2024": 9485, "2025": 9594 },
  { provincia: "Verbano-Cusio-Ossola", "2020": 2363, "2021": 2044, "2022": 2256, "2023": 2103, "2024": 2005, "2025": 2038 },
  { provincia: "Vercelli", "2020": 3183, "2021": 2549, "2022": 2551, "2023": 2422, "2024": 2298, "2025": 2370 },
  { provincia: "Verona", "2020": 11205, "2021": 9641, "2022": 9985, "2023": 9349, "2024": 8995, "2025": 9358 },
  { provincia: "Vibo Valentia", "2020": 1731, "2021": 1837, "2022": 1884, "2023": 1755, "2024": 1637, "2025": 1610 },
  { provincia: "Vicenza", "2020": 9751, "2021": 8863, "2022": 9223, "2023": 8364, "2024": 8361, "2025": 8490 },
  { provincia: "Viterbo", "2020": 3965, "2021": 3967, "2022": 4252, "2023": 3854, "2024": 3938, "2025": 3668 },
];

export function ProvinceChart() {
  const [selectedProvincia, setSelectedProvincia] = useState("Roma");

  // Trova i dati per la provincia selezionata
  const selectedData = provinceData.find(p => p.provincia === selectedProvincia);
  
  // Trasforma i dati per il grafico
  const chartData = selectedData ? [
    { year: '2020', value: selectedData["2020"] },
    { year: '2021', value: selectedData["2021"] },
    { year: '2022', value: selectedData["2022"] },
    { year: '2023', value: selectedData["2023"] },
    { year: '2024', value: selectedData["2024"] },
    { year: '2025', value: selectedData["2025"] }
  ] : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Valore: <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <MapPin className="h-5 w-5 text-green-500" />
          </div>
          Analisi per Provincia
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Trend temporale per provincia - Seleziona una provincia per visualizzare i dati
        </p>
        
        {/* Filtro Provincia */}
        <div className="mt-4">
          <label htmlFor="provincia-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Seleziona Provincia:
          </label>
          <select
            id="provincia-select"
            value={selectedProvincia}
            onChange={(e) => setSelectedProvincia(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {provinceData.map((provincia) => (
              <option key={provincia.provincia} value={provincia.provincia}>
                {provincia.provincia}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Statistiche rapide */}
        {selectedData && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">Valore Iniziale (2020)</div>
              <div className="text-lg font-bold text-green-700 dark:text-green-300">
                {selectedData["2020"].toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Valore Finale (2025)</div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {selectedData["2025"].toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}