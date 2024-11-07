import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'


export type TodoType = {
  id: number,
  title: string,
  description: string,
  isCompleted?: boolean,
  category: string,
}

export type MoodType = {
  name: string,
  date: Date,
}

const storeMoodLocal = async (value: MoodType[]) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('list-mood', jsonValue);
  } catch (e) {
       //saving error
  }
};

const getMoodLocal = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('list-mood');
    if(jsonValue != null) {
      const json = (JSON.parse(jsonValue) || []).map((mood: MoodType) => {
        mood.date = new Date(mood.date)
        return mood
      })
      console.log(json)
      return json
    }
    return [];
  } catch {
    // error reading value
  }  
};

type TaskTodoInterface = {
  todoTask: TodoType[],
  addTask: Dispatch<SetStateAction<TodoType[]>>,
  isPending: boolean,
  setIsPending: Dispatch<SetStateAction<boolean>>,
  completeTask: Dispatch<SetStateAction<Boolean>>,
  removeTask: Dispatch<SetStateAction<TodoType[]>>,
  mood: MoodType[];
  setMood: (value: MoodType[]) => Promise<void>,
}

const TodoContext = createContext<TaskTodoInterface>({} as TaskTodoInterface);

type TodoProviderProps = {
  children: ReactNode
}

export function TodoProvider ({ children }: TodoProviderProps) {
  const [todo, setTodoTask] = useState<TodoType[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [mood, setMoods] = useState<MoodType[]>([]);

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const moods = await getMoodLocal()
    setMoods([...mood, ...moods])
  }

  const setMood = async (value: MoodType[]) => {
    setMoods([...mood, ...value])
    await storeMoodLocal([...mood, ...value])
  }

  const value: TaskTodoInterface = {
    todoTask: todo,
    addTask: setTodoTask,
    setIsPending: setIsPending,
    isPending: isPending,
    mood,
    setMood,
    completeTask: () => {},
    removeTask: () => {}
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  )
};

export function useTodoProvider() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('verifique o uso do useTodoProvider');
  }
  return context;
};