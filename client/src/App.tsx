import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert'
import { BadgeInfo } from 'lucide-react'
import { ThemeToggle } from './components/theme-toggler'
import { useEffect, useState } from 'react'
import Axios from './lib/axio'
import { toast } from 'sonner'

function App() {
  const [values, setValues] = useState<number[]>([])
  const [indexes, setIndexes] = useState<{ number: number }[]>([])
  const [value, setValue] = useState<number>(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(parseInt(e.target.value));

  async function handleSubmit() {
    try {
      Axios.post(`/api/fibonacci/${value}`)
      setValue(0)
    } catch (error) {
      toast.error('Something went wrong, Please try again later.')
    }
  }

  async function fetchIndexes() {
    try {
      const res = await Axios.get('/api/values/all')
      if (res.data) setIndexes(res.data)
    } catch (error) {
      toast.error('Something went wrong, Please try again later.')
    }
  }

  async function fetchValues() {
    try {
      const res = await Axios.get('/api/values/current')
      if (res.data) setValues(res.data)
    } catch (error) {
      toast.error('Something went wrong, Please try again later.')
    }
  }

  useEffect(() => {
    fetchIndexes()
    fetchValues()
  }, [])

  return (
    <div className='bg-background w-screen h-screen flex items-center justify-center p-5 flex-col gap-5'>
      <div className='flex items-center justify-center gap-5'>
        <ThemeToggle />
      </div>
      <Card className='max-w-96 w-full'>
        <CardHeader>
          <CardTitle>Fibonacci Sequence Calculator</CardTitle>
          <CardDescription>Enter a number and see the Fibonacci sequence up to that point.</CardDescription>
          <CardDescription>
            <small>I have seen: {indexes && indexes.map(({ number }) => number).join(', ')}</small>
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-5'>
          <Input placeholder='Enter a number' type='number' onChange={handleChange} />
          <Button onClick={handleSubmit} className='w-full'>Calculate</Button>
        </CardContent>
        <CardFooter>
          <Alert>
            <BadgeInfo className="h-4 w-4" />
            <AlertTitle>Calculated values:</AlertTitle>
            <AlertDescription>
              {values && Object.entries(values).map(([key, value]) => (
                <span key={key}>
                  for index {key} the value is {value}
                </span>
              ))}
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App
