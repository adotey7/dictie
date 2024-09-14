import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import searchSchema from "./lib/schema";

import { getWord } from "./lib/api";
import { toast } from "sonner";
import { useState } from "react";

interface Definitions {
  wordName: string;
  phonetic: string;
  meanings: Meanings[];
}

interface Definition {
  definition: string;
  example: string;
}

interface Meanings {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

function App() {
  const [definitions, setDefinitions] = useState<Definitions | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: "" },
  });

  async function onSubmit(values: z.infer<typeof searchSchema>) {
    try {
      setLoading(true);
      const response = await getWord(values.search);

      setDefinitions(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="max-h-full w-full">
        <Toaster richColors />
        <div className="container mx-auto h-full w-3/4">
          <h1 className="text-center mt-4 mb-9 text-4xl font-bold text-gray-700 lg:text-5xl">
            Dictionary
          </h1>
          <p className="mb-7 text-center font-medium lg:text-2xl text-gray-700">
            We can help you find the meaning of any word. Any word at all 🌐
          </p>
          <div className="flex justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full max-w-sm items-center justify-center space-x-2"
              >
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Search word..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {loading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit" className="bg-gray-700">
                    Submit
                  </Button>
                )}
              </form>
            </Form>
          </div>

          {/* Definitions */}
          {definitions && (
            <>
              <div className="mt-14">
                <h2 className="text-3xl font-bold text-gray-700">
                  {definitions.wordName}
                </h2>{" "}
                <h3 className="mt-2 pl-14 text-xl font-semibold text-yellow-600">
                  {definitions.phonetic}
                </h3>
              </div>

              {/* Meanings */}
              {definitions.meanings.map((meaning: Meanings, index: number) => (
                <div className="mt-8" key={index}>
                  <h2>{meaning.partOfSpeech}</h2>
                  <div className="mt-2 inline">
                    <h4 className="inline font-normal text-yellow-600">
                      Definition(s):
                    </h4>
                    {meaning.definitions.map(
                      (definition: Definition, i: number) => (
                        <>
                          <p
                            className={i === 0 ? "inline-block" : "block mt-2"}
                            key={i}
                          >
                            {definition.definition}
                          </p>
                          <p className="mt-1 pl-10 italic text-yellow-600">
                            {definition.example}
                          </p>
                        </>
                      )
                    )}
                  </div>
                  {/* Synonyms and Antonyms */}
                  {meaning.synonyms.length > 0 && (
                    <div className="mt-2 flex flex-wrap">
                      <span className="mr-1">
                        <h4 className="font-normal text-yellow-600">
                          Synonyms:
                        </h4>
                      </span>
                      {meaning.synonyms.map((synonym: string, i: number) => (
                        <p className="mr-2" key={i}>
                          {synonym}
                        </p>
                      ))}
                    </div>
                  )}

                  {meaning.antonyms.length > 0 && (
                    <div className="mt-2 flex flex-wrap">
                      <span className="mr-1">
                        <h4 className="font-normal text-yellow-600">
                          Antonyms:
                        </h4>
                      </span>
                      {meaning.antonyms.map((antonym: string, i: number) => (
                        <p className="mr-2" key={i}>
                          {antonym}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
