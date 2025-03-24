
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AssessmentGuide from "@/components/AssessmentGuide";

const WhatIsDyslexia = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">What is Dyslexia?</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Definition</h2>
              <p className="mb-4">
                Dyslexia is a specific learning disability that is neurobiological in origin. It is characterized by 
                difficulties with accurate and/or fluent word recognition and by poor spelling and decoding abilities. 
                These difficulties typically result from a deficit in the phonological component of language that is 
                often unexpected in relation to other cognitive abilities and the provision of effective classroom 
                instruction.
              </p>
              <p>
                Secondary consequences may include problems in reading comprehension and reduced reading experience 
                that can impede growth of vocabulary and background knowledge.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Common Signs of Dyslexia</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">In Preschool Children (Ages 3-5)</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Delayed speech development</li>
                    <li>Difficulty with rhyming words</li>
                    <li>Trouble learning the alphabet, numbers, days of the week</li>
                    <li>Difficulty following multi-step directions</li>
                    <li>Poor name-object association</li>
                    <li>Confusion with before/after, right/left, etc.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">In School-Age Children (Ages 5-12)</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Difficulty learning to read despite conventional instruction</li>
                    <li>Slow, inaccurate reading</li>
                    <li>Poor spelling, often not phonetic</li>
                    <li>Confusion with similar-looking letters (b/d, p/q)</li>
                    <li>Difficulty copying from the board</li>
                    <li>Struggles with math word problems</li>
                    <li>Avoidance of reading activities</li>
                    <li>Difficulty organizing thoughts in writing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">In Teenagers and Adults</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Continued reading difficulties</li>
                    <li>Slow reading and writing speed</li>
                    <li>Poor spelling</li>
                    <li>Difficulty taking notes</li>
                    <li>Poor organization in written work</li>
                    <li>Difficulty learning a foreign language</li>
                    <li>Low self-esteem related to academics</li>
                    <li>Development of compensatory strategies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Cognitive Areas Affected</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Phonological Awareness:</span> The ability to recognize and manipulate sounds in language.</li>
                <li><span className="font-medium">Rapid Naming:</span> The ability to quickly name familiar visual symbols and concepts.</li>
                <li><span className="font-medium">Working Memory:</span> The system that temporarily holds and processes information during cognitive tasks.</li>
                <li><span className="font-medium">Processing Speed:</span> The time it takes to process information and respond appropriately.</li>
                <li><span className="font-medium">Visual Processing:</span> The ability to make sense of information taken in through the eyes.</li>
                <li><span className="font-medium">Sequencing:</span> The ability to arrange things in a logical order or pattern.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Strengths Associated with Dyslexia</h2>
              <p className="mb-4">
                While dyslexia presents challenges, many individuals with dyslexia also demonstrate significant strengths in other areas:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Exceptional creativity and innovation</li>
                <li>Strong problem-solving skills</li>
                <li>Big-picture thinking and pattern recognition</li>
                <li>Spatial reasoning and 3D thinking</li>
                <li>Entrepreneurial mindset</li>
                <li>Strong oral communication</li>
                <li>Persistence and resilience</li>
                <li>Intuitive understanding of complex systems</li>
              </ul>
              <p className="mt-4">
                Many successful entrepreneurs, artists, scientists, and leaders have dyslexia and attribute their success 
                to the different ways they think and approach problems.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Our Assessment Approach</h2>
              <p className="mb-4">
                Our assessment tools measure the key cognitive areas affected by dyslexia:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Age-appropriate dyslexia checklists</li>
                <li>Handwriting analysis</li>
                <li>Rapid naming tests</li>
                <li>Phonemic awareness assessment</li>
                <li>Working memory evaluation</li>
                <li>Visual processing tasks</li>
                <li>Processing speed measurement</li>
                <li>Sequencing abilities</li>
              </ul>
              <p>
                These assessments can help identify potential indicators of dyslexia, but they are not a clinical diagnosis. 
                Results should be discussed with educational specialists.
              </p>
            </CardContent>
          </Card>
        
          <AssessmentGuide />
        </div>
      </div>
    </div>
  );
};

export default WhatIsDyslexia;
