import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SignUpFormData } from '@/lib/interface'
import { register } from '@/lib/api'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff } from 'lucide-react'
import { auth } from '@/lib/services'
import { useNavigate } from 'react-router-dom'

export function SignUpModal() {
  const {toast} = useToast()
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if(formData.password !== formData.confirmPassword){
        toast({
          variant: 'destructive',
          title: "Password does not match",
          description: ''
        })
      } else {    
        await register(formData)
          .then((data:any) => {
            if(data.data){
              auth.storeToken(data.data.token)
              navigate('/user')
            }
        })
          .catch((_err:any) => {
            toast({
              variant: 'destructive',
              title: "Sign Up Failed",
              description: 'Username already used'
            })
          })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Dialog>
      <Toaster />
      <DialogTrigger asChild>
        <Button className="w-36 h-12 bg-[#8f6b07] hover:bg-[#dab641] text-white rounded-lg">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px] bg-[#f0f0f0] rounded-[15px]">
        <form onSubmit={handleSubmitRegistration} className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-black">Sign Up</h2>
          <Input
            placeholder="Create Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="h-12 rounded-lg bg-[#f0f0f0] text-black"
            required
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="h-12 rounded-lg bg-[#f0f0f0] text-black pr-10"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
            >
              {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="h-12 rounded-lg bg-[#f0f0f0] text-black pr-10"
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
          <div className="flex justify-center space-x-4">
            <Button type="submit" className="w-24 h-12 bg-[#8f6b07] hover:bg-[#dab641] text-white rounded-lg">
              Sign Up
            </Button>
            <DialogTrigger asChild>
              <Button type="button" className="w-24 h-12 bg-[#8f6b07] hover:bg-[#dab641] text-white rounded-lg">
                Exit
              </Button>
            </DialogTrigger>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

