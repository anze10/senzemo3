import { NextApiRequest, NextApiResponse } from 'next';
import { db, devices } from 'src/server/db/schema';
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    try {
        if (method === 'POST') {
            const { action, data } = req.body;

            if (action === 'add') {
                await db.insert(devices).values(data);
            } else if (action === 'delete') {
                await db.delete(devices).where({ dev_id: data.dev_id });
            } else if (action === 'modify') {
                await db.update(devices).set(data).where({ dev_id: data.dev_id });
            }

            res.status(200).json({ message: 'Success' });
        } else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
