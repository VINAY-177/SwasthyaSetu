import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Get all hospitals
app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await prisma.hospital.findMany();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// Get all government schemes
app.get('/api/schemes', async (req, res) => {
  try {
    const schemes = await prisma.governmentScheme.findMany();
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch government schemes' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
