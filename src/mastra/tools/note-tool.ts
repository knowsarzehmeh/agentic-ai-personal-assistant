import { createTool } from "@mastra/core/tools";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";



const NOTE_FILE = join(process.cwd(), 'data/notes.json')

type Note = {
    id: string;
    content: string;
    title?: string;
    createdAt: string;
}


async function loadNotes(): Promise<Note[]> {
    try {
        const data = await readFile(NOTE_FILE, 'utf-8');
        return JSON.parse(data) as Note[];
    } catch {

        await mkdir(join(process.cwd(), 'data'), { recursive: true })
        await writeFile(NOTE_FILE, JSON.stringify([]))
        return []
    }
}

export const saveNoteTool = createTool({
    id: 'save-note',
    description: 'Save a note to the notes file. The note will be saved with a unique ID and a creation timestamp.',
    inputSchema: z.object({
        content: z.string().describe('The content of the note'),
        title: z.string().optional().describe('The title of the note'),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
        noteId: z.string()
    }),

    execute: async ({ title, content }) => {
        try {
            const notes = await loadNotes()

            const note: Note = {
                id: crypto.randomUUID(),
                content,
                title,
                createdAt: new Date().toISOString(),
            }
            notes.push(note)
            await writeFile(NOTE_FILE, JSON.stringify(notes, null, 2))
            return {
                success: true,
                message: `Note saved successfully with title "${title}"`,
                noteId: note.id
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed to save note',
                noteId: ''
            }
        }
    }
})