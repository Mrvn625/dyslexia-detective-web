
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const WhatIsDyslexia = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">What is Dyslexia?</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Definition</h2>
          <p className="mb-4">
            Dyslexia is a learning disorder characterized by difficulties with accurate and fluent word recognition, 
            poor spelling, and decoding abilities. These difficulties typically result from a deficit in the phonological 
            component of language that is often unexpected in relation to other cognitive abilities and the provision of 
            effective classroom instruction.
          </p>
          <p>
            It's important to note that dyslexia is not related to intelligence. People with dyslexia have normal 
            intelligence and often have normal or above-average vision.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Common Signs of Dyslexia</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">In Children</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Late talking</li>
                <li>Learning new words slowly</li>
                <li>Problems forming words correctly</li>
                <li>Difficulty rhyming</li>
                <li>Trouble learning the alphabet, numbers, colors, shapes, days of the week</li>
                <li>Difficulty learning to read or write</li>
                <li>Reading well below the expected level for age</li>
                <li>Avoiding activities that involve reading</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">In Teenagers and Adults</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Difficulty reading, including reading aloud</li>
                <li>Slow and labor-intensive reading and writing</li>
                <li>Problems spelling</li>
                <li>Avoiding activities that involve reading</li>
                <li>Mispronouncing names or words, or problems retrieving words</li>
                <li>Trouble understanding jokes or expressions that have a meaning not easily understood from the specific words</li>
                <li>Spending an unusually long time completing tasks that involve reading or writing</li>
                <li>Difficulty summarizing stories</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Misconceptions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-medium">Dyslexia is not about reversing letters.</span> While some people with dyslexia do reverse letters, this is not the primary characteristic of dyslexia.</li>
            <li><span className="font-medium">Dyslexia is not a vision problem.</span> It's a language processing disorder that affects how the brain processes written and sometimes spoken language.</li>
            <li><span className="font-medium">Dyslexia is not due to lack of intelligence or desire to learn.</span> People with dyslexia have normal intelligence and are often very creative and successful in many fields.</li>
            <li><span className="font-medium">Dyslexia is not outgrown.</span> It is a lifelong condition, but with proper support and interventions, people with dyslexia can learn strategies to overcome their challenges.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Prevalence and Support</h2>
          <p className="mb-4">
            Dyslexia is one of the most common learning disorders, affecting approximately 15-20% of the population. 
            It occurs in people of all backgrounds and intellectual levels.
          </p>
          <p className="mb-4">
            With appropriate teaching methods, guidance, and support, people with dyslexia can succeed in school and go on to successful careers. 
            Many famous scientists, artists, entrepreneurs, and leaders have dyslexia and attribute their success to the different ways they think and process information.
          </p>
          <p>
            Early identification and intervention are key to helping individuals with dyslexia achieve their full potential.
            Our assessment tools are designed to help identify potential signs of dyslexia, but they are not a replacement for a professional diagnosis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatIsDyslexia;
