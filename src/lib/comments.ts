import fs from 'fs';
import path from 'path';

export interface Comment {
  text: string;
  timestamp: string;
}

export interface WebcamData {
  visitCount: number;
  comments: Comment[];
}

const DATA_FILE = path.join(process.cwd(), 'data', 'comments.json');

export function getWebcamData(webcamId: string): WebcamData {
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(fileData);
    return data[webcamId] || { visitCount: 0, comments: [] };
  } catch (error) {
    console.error('Error reading comments file:', error);
    return { visitCount: 0, comments: [] };
  }
}

export function addComment(webcamId: string, commentText: string): void {
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(fileData);
    
    if (!data[webcamId]) {
      data[webcamId] = { visitCount: 0, comments: [] };
    }
    
    data[webcamId].comments.push({
      text: commentText,
      timestamp: new Date().toISOString(),
    });
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing comments file:', error);
  }
}

export function incrementVisitCount(webcamId: string): void {
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(fileData);
    
    if (!data[webcamId]) {
      data[webcamId] = { visitCount: 0, comments: [] };
    }
    
    data[webcamId].visitCount += 1;
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error incrementing visit count:', error);
  }
}

