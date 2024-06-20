import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import validator from 'validator';
import axios from 'axios';

const base_path = 'files';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(newBlob: any, file: Express.Multer.File) {
    try{
      const sanitizedBlobValue = validator.escape(newBlob.value);
      const filePath = path.join(base_path, sanitizedBlobValue);

      // Salva il file
      fs.writeFileSync(filePath, file.buffer);

      // Leggi il contenuto del file
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Analizza il contenuto del file
      const analysis = this.analyzeText(fileContent);

      return {
        blob: sanitizedBlobValue,
        analysis,
      };
    } catch (error) {
      throw new Error(`Errore nella lettura del file locale: ${error.message}`);
    }
    
  }

  async analyzeRemoteFile(url: string) {
    try {
      const response = await axios.get(url);
      const fileContent = response.data;

      // Analizza il contenuto del file
      const analysis = this.analyzeText(fileContent);

      return analysis;
    } catch (error) {
      throw new Error(`Errore nella lettura del file remoto: ${error.message}`);
    }
  }

  private analyzeText(text: string) {
    const words = text.match(/\b\w+\b/g) || [];
    const letters = text.match(/[a-zA-Z]/g) || [];
    const spaces = text.match(/\s/g) || [];
    const wordCount = {};

    words.forEach(word => {
      word = word.toLowerCase();
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const repeatedWords = Object.entries(wordCount).filter(([word, count]: any) => count > 10);

    return {
      totalWords: words.length,
      totalLetters: letters.length,
      totalSpaces: spaces.length,
      repeatedWords: repeatedWords.map(([word, count]) => ({ word, count })),
    };
  }
}
