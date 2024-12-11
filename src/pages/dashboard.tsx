import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/lib/services'
import { getBudget, getExpenses, setBudget, addExpense, resetExpenses, updateExpense, deleteExpense } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function Dashboard() {
  const router = useNavigate()
  const [activeTab, setActiveTab] = useState('about')
  const user = auth.getUserInfo()
  const [budget, setBudgetState] = useState<number | null>(null)
  const [expenses, setExpensesState] = useState<any[]>([])
  const [newBudget, setNewBudget] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseDescription, setExpenseDescription] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const [updatedAmount, setUpdatedAmount] = useState(0)
  const [updatedDescription, setUpdatedDescription] = useState('')
  const [updatedDate, setUpdatedDate] = useState('')

  useEffect(() => {
    if (!auth.getToken()) {
      router('/')
    } else {
      const currentTime = Date.now(); 
     if(currentTime >= auth.getExpiration() * 1000){
      router('/')
     }else{
      fetchBudget()
      fetchExpenses()
     }
    }
  }, [])

  const handleLogout = () => {
    try {
      auth.clear()
      router('/')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout failed', error)
      toast.error('Failed to logout')
    }
  }

  const fetchBudget = async () => {
    try {
      if (user.id) {
        const data = await getBudget(user.id) as unknown as any
        if (data.data) {
          setBudgetState(data.data.budget)
        }
      }
    } catch (error) {
      console.error('Error fetching budget', error)
    }
  }

  const fetchExpenses = async () => {
    try {
      if (user.id) {
        const data = await getExpenses(user.id) as unknown as any
        if (data.data) {
          setExpensesState(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching expenses', error)
    }
  }

  const handleSetBudget = async () => {
    try {
      if (user.id && newBudget) {
        const response = await setBudget(user.id, parseFloat(newBudget)) as unknown as any
        if (response.data) {
          await fetchBudget()
          setNewBudget('')
          toast.success('Budget set successfully')
        }
      }
    } catch (error) {
      console.error('Error setting budget:', error)
      toast.error('Failed to set budget')
    }
  }

  const handleAddExpense = async () => {
    try {
      if (user.id && parseFloat(expenseAmount) > 0) {
        const response = await addExpense(user.id, parseFloat(expenseAmount), expenseDescription, expenseDate ? new Date(expenseDate) : new Date()) as unknown as any
        if (response.data) {
          await fetchExpenses()
          setExpenseAmount('')
          setExpenseDescription('')
          setExpenseDate('')
          toast.success('Expense added successfully')
        }
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      toast.error('Failed to add expense')
    }
  }

  const handleResetBudget = async () => {
    try {
      if (user.id) {
        const response = await resetExpenses(user.id) as unknown as any
        if (response.data) {
          await fetchBudget()
          setExpensesState([])
          setShowResetConfirm(false)
          toast.success('Budget and expenses reset successfully')
        }
      }
    } catch (error) {
      console.error('Error resetting budget:', error)
      toast.error('Failed to reset budget and expenses')
    }
  }

  const handleUpdateExpense = async (id: string) => {
    try {
      if (user.id && updatedAmount > 0) {
        const response = await updateExpense(user.id, id, updatedAmount, updatedDescription, new Date(updatedDate)) as unknown as any
        if (response.data) {
          await fetchExpenses()
          setEditingExpense(null)
          setUpdatedAmount(0)
          setUpdatedDescription('')
          setUpdatedDate('')
          toast.success('Expense updated successfully')
        }
      }
    } catch (error) {
      console.error('Error updating expense:', error)
      toast.error('Failed to update expense')
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      if (user.id) {
        const response = await deleteExpense(user.id, id) as unknown as any
        if (response.data) {
          await fetchExpenses()
          toast.success('Expense deleted successfully')
        }
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast.error('Failed to delete expense')
    }
  }

  const calculateRemainingBudget = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0)
    return budget !== null ? budget - totalExpenses : null
  }

  return (
    <div className="flex flex-col min-h-screen text-black">
      <header className="bg-[#FFF8DC] p-4">
        <h1 className="text-4xl font-bold text-center">Daily Finances</h1>
      </header>

      <div className="flex flex-1">
        <div className="w-64 bg-[#F4D03F] p-4 space-y-4">
          <button
            onClick={() => setActiveTab('about')}
            className={`w-full p-4 rounded-lg text-center font-bold ${
              activeTab === 'about' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8DC] hover:bg-[#FFE4B5]'
            }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => setActiveTab('add-expenses')}
            className={`w-full p-4 rounded-lg text-center font-bold ${
              activeTab === 'add-expenses' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8DC] hover:bg-[#FFE4B5]'
            }`}
          >
            ADD EXPENSES
          </button>
          <button
            onClick={() => setActiveTab('list-expenses')}
            className={`w-full p-4 rounded-lg text-center font-bold ${
              activeTab === 'list-expenses' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8DC] hover:bg-[#FFE4B5]'
            }`}
          >
            LIST OF EXPENSES
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`w-full p-4 rounded-lg text-center font-bold ${
              activeTab === 'budget' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8DC] hover:bg-[#FFE4B5]'
            }`}
          >
            BUDGET
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className={`w-full p-4 rounded-lg text-center font-bold ${
              activeTab === 'reset' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8DC] hover:bg-[#FFE4B5]'
            }`}
          >
            RESET
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full p-4 rounded-lg text-center font-bold bg-[#FFF8DC] hover:bg-[#FFE4B5]"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 bg-[#ca9a5c] p-8">
          <div className="h-full p-8 rounded-lg ">
            {activeTab === 'about' && (
              <div className="bg-[#FFF8DC] rounded-2xl flex flex-col items-center justify-center h-full">
                <h2 className="mb-4 text-4xl font-bold">About</h2>
                <p className="text-2xl text-center">
                  This website will help you track your daily finances.
                </p>
              </div>
            )}

            {activeTab === 'add-expenses' && (
              <div className="bg-[#ca9a5c] flex flex-col items-center justify-center h-full">
                <h2 className="mb-8 text-4xl font-bold">Add Expenses</h2>
                <div className="w-full max-w-md space-y-4">
                  <input
                    type="text"
                    value={expenseAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        setExpenseAmount(value === '' ? '' : Number(value).toString());
                      }
                    }}
                    placeholder="Enter amount"
                    className="w-full p-4 border border-[#ca9a5c]-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full p-4 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleAddExpense}
                    className="mx-auto block px-8 py-2 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-bold"
                  >
                    ADD
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'list-expenses' && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-full p-4 bg-white rounded-2xl">
                  <div className="grid grid-cols-5 gap-4 mb-4 font-bold">
                    <div>Description</div>
                    <div>Amount</div>
                    <div>Date</div>
                    <div>Update</div>
                    <div>Delete</div>
                  </div>
                  {expenses.map((expense) => (
                    <div key={expense._id} className="grid grid-cols-5 gap-4 mb-2">
                      {editingExpense === expense._id ? (
                        <>
                          <input
                            type="text"
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                            className="p-1 border rounded"
                          />
                          <input
                            type="text"
                            value={updatedAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d+$/.test(value)) {
                                setUpdatedAmount(value === '' ? 0 : Number(value));
                              }
                            }}
                            className="p-1 border rounded"
                          />
                          <input
                            type="date"
                            value={updatedDate}
                            onChange={(e) => setUpdatedDate(e.target.value)}
                            className="p-1 border rounded"
                          />
                          
                          <button
                            onClick={() => handleUpdateExpense(expense._id)}
                            className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingExpense(null)}
                            className="px-2 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <div>{expense.description}</div>
                          <div>₱{expense.value}</div>
                          <div>{new Date(expense.date).toLocaleDateString()}</div>
                          <button
                            onClick={() => {
                              setEditingExpense(expense._id)
                              setUpdatedAmount(expense.value)
                              setUpdatedDescription(expense.description)
                              setUpdatedDate(new Date(expense.date).toISOString().split('T')[0])
                            }}
                            className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 font-bold">
                  Total: ₱{expenses.reduce((sum, expense) => sum + expense.value, 0)}
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="flex flex-col items-center justify-center h-full bg-[#c99a5b] rounded-lg">

                <div className="w-full max-w-md space-x-8 space-y-2 text-lg">
                  <table className='w-full'>
                    <tbody>
                      <tr>
                        <td width={350}>
                          <span className="font-semibold">Current Budget:</span>
                        </td>
                        <td>
                          ₱{budget !== null ? `${budget}` : 'Not set'}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="font-semibold">Total Expenses:</span>
                        </td>
                        <td>
                          ₱{expenses.reduce((sum, expense) => sum + expense.value, 0)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                        <span className="font-semibold">Remaining Budget:</span>
                        </td>
                        <td>
                        {calculateRemainingBudget() !== null ? `₱${calculateRemainingBudget()}` : 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex flex-col items-center mt-2">
                    <input
                      type="text"
                      value={newBudget}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d+$/.test(value)) {
                          setNewBudget(value === '' ? '' : Number(value).toString());
                        }
                      }}
                      placeholder="Set new budget"
                      className="w-full max-w-sm p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow -400"
                    />
                    <button
                      onClick={handleSetBudget}
                      className="px-8 py-3 w-full max-w-sm rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-semibold text-gray-800 shadow-md transition ease-in-out duration-200"
                    >
                      Set Budget
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#F4D03F] p-8 rounded-lg text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <p className="mb-4 text-xl">Are you sure you want to reset your expenses?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleResetBudget}
                className="px-8 py-2 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-bold"
              >
                YES
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-8 py-2 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-bold"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#F4D03F] p-8 rounded-lg text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <p className="mb-4 text-xl">Are you sure you want to Logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-8 py-2 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-bold"
              >
                YES
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-8 py-2 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-bold"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

