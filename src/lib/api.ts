/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

export const getWord = async (word: string) => {
  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    const data = response.data[0]
    const wordName = data.word
    const phonetic = data.phonetic ?? ''
    const meanings = data.meanings.map((meaning: any) => {
      return {
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.map((definition: any) => {
          return {
            definition: definition.definition,
            example: definition.example ?? ''
          }
        }),
        synonyms: meaning.synonyms,
        antonyms: meaning.antonyms
      }
    })

    return { wordName, phonetic, meanings }

  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      throw new Error(message);
    } else if (error.request) {
      throw new Error("Network Error");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
