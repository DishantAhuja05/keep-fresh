import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Wrench } from 'lucide-react';
import { Task } from '../types';

interface TaskTrackerProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onCompleteTask: (id: string) => void;
}

const TaskTracker: React.FC<TaskTrackerProps> = ({ tasks, onAddTask, onCompleteTask }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [freq, setFreq] = useState(30);

  const handleAdd = () => {
    if(!newTaskName) return;
    const now = new Date();
    const nextDue = new Date();
    nextDue.setDate(now.getDate() + freq);

    const task: Task = {
      id: Date.now().toString(),
      name: newTaskName,
      frequencyDays: freq,
      lastCompleted: now.toISOString(),
      nextDue: nextDue.toISOString()
    };
    onAddTask(task);
    setNewTaskName('');
    setShowAdd(false);
  };

  const getDueStatus = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) return { label: `Overdue by ${Math.abs(days)} days`, color: 'text-red-600' };
    if (days <= 3) return { label: `Due in ${days} days`, color: 'text-yellow-600' };
    return { label: `Due in ${days} days`, color: 'text-gray-500' };
  };

  return (
    <div className="h-full flex flex-col pb-24">
      <div className="bg-orange-500 text-white p-6 rounded-b-3xl shadow-lg mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Wrench className="mr-2" /> Maintenance
        </h1>
        <p className="text-orange-100 text-sm">Keep your home running smoothly.</p>
      </div>

      <div className="px-4 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">Pending Tasks</h2>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="text-orange-600 text-sm font-bold flex items-center"
          >
            <Plus size={16} className="mr-1" /> Add Task
          </button>
        </div>

        {showAdd && (
          <div className="bg-white p-4 rounded-xl shadow-md mb-4 border border-orange-100 animate-slide-up">
            <h3 className="font-semibold mb-3">Add New Task</h3>
            <input 
              type="text" 
              placeholder="Task Name (e.g. Change Filter)"
              className="w-full border rounded-lg p-2 mb-3 text-sm"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-600 mr-2">Repeat every</span>
              <input 
                type="number" 
                className="w-16 border rounded-lg p-2 text-sm"
                value={freq}
                onChange={(e) => setFreq(parseInt(e.target.value))}
              />
              <span className="text-sm text-gray-600 ml-2">days</span>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowAdd(false)} className="text-sm text-gray-500 px-3 py-1">Cancel</button>
              <button onClick={handleAdd} className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg font-medium">Save</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map(task => {
            const status = getDueStatus(task.nextDue);
            return (
              <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800">{task.name}</h4>
                  <p className={`text-xs font-medium ${status.color}`}>{status.label}</p>
                </div>
                <button 
                  onClick={() => onCompleteTask(task.id)}
                  className="text-gray-300 hover:text-green-500 transition-colors"
                >
                  <Circle size={28} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskTracker;
