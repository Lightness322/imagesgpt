import OpenAI from "openai"
import { useEffect, useRef, useState } from "react"
import Progress from "./Progress"

let reader = new FileReader()

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
})

function App() {
  const [images, setImages] = useState([])
  const [answers, setAnswers] = useState([])
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function readFile(e) {
    let file = e.target.files[0]

    reader.readAsText(file, "UTF-8")

    reader.onload = function () {
      console.log(reader.result)
      const imagesArray = reader.result
        .split("\n")
        .slice(0, -1)
        .map((strPair) => {
          const arrPair = strPair.split(";")
          return { firstImage: arrPair.at(0), secondImage: arrPair.at(1) }
        })
      console.log(imagesArray)
      setImages(imagesArray)
      this.abort()
    }

    reader.onerror = function () {
      console.log(reader.error)
    }
  }

  async function main(prompt, images) {
    try {
      let i = 0
      let quantity = images.length

      while (i < quantity) {
        console.log(images.at(i).firstImage)
        console.log(images.at(i).secondImage)

        const response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `${prompt}`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `${images.at(i).firstImage}`,
                  },
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `${images.at(i).secondImage}`,
                  },
                },
              ],
            },
          ],
        })
        let answer = response.choices.at(0).message.content
        console.log(response)
        console.log(response.choices.at(0))
        setAnswers((answers) => [...answers, answer])
        i++
      }
    } catch (e) {
      console.log(e)
    }
  }

  const ref = useRef(null)

  useEffect(() => {
    if (answers.length === images.length) {
      setIsLoading(false)
    }
  }, [answers.length, images.length])

  return (
    <div className="max-w-[1280px] mx-auto p-5 flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-6 items-center">
        <label className="w-full flex justify-center">
          <input
            value={prompt}
            className="border-solid p-2 w-[80%] border-[2px] border-sky-400"
            placeholder="Введите prompt"
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <label>
          <input
            ref={ref}
            className="hidden"
            type="file"
            onChange={(e) => {
              readFile(e)
              ref.current.value = ""
            }}
          />
          <span
            className="bg-sky-400 rounded-md p-2 max-w-[100px] font-bold hover:bg-sky-600 cursor-pointer"
            disabled={images.length > 0}
          >
            {images.length > 0 ? "Файл загружен" : "Загрузите файл"}
          </span>
        </label>
        <div className="flex gap-x-6">
          <button
            className="bg-sky-400 rounded-md p-2 max-w-[100px] font-bold hover:bg-sky-600 disabled:bg-zinc-400 disabled:cursor-not-allowed"
            onClick={() => {
              setIsLoading(true)
              main(prompt, images)
            }}
            disabled={images.length === 0 || isLoading}
          >
            Начать
          </button>
          <button
            className="bg-zinc-400 rounded-md p-2 max-w-[100px] font-bold hover:bg-zinc-500"
            onClick={() => {
              setAnswers([])
              setImages([])
              setPrompt("")
            }}
          >
            Сброс
          </button>
        </div>
        <Progress answers={answers} images={images} isLoading={isLoading} />
      </div>
      <div className="flex flex-col gap-y-3">
        {images.map((imagePair, i) => (
          <div
            className="grid grid-cols-[480px_1fr] items-center w-max"
            key={i}
          >
            <div className="flex h-[230px] w-[480px] gap-x-[20px]">
              <img
                className="object-contain object-center w-[230px]"
                src={`${imagePair.firstImage}`}
              />
              <img
                className="object-contain object-center w-[230px]"
                src={`${imagePair.secondImage}`}
              />
            </div>
            <div className="bg-purple-200 rounded-xl font-bold flex justify-center items-center p-2">
              <span>{answers.at(i)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
