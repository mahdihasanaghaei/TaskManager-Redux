
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { setFilter, setSortBy, setSortOrder } from '../store/taskSlice';
import { 
  Container, 
  Typography, 
  Button, 
  Select, 
  MenuItem, 
  IconButton,
  Paper
} from '@mui/material';
import { SwapVert } from '@mui/icons-material';

const Index = () => {
  const dispatch = useDispatch();
  const { tasks, filter, sortBy, sortOrder } = useSelector((state: RootState) => state.tasks);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate' && a.dueDate && b.dueDate) {
      return sortOrder === 'asc' 
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    
    if (sortBy === 'priority') {
      const priorities = { low: 1, medium: 2, high: 3 };
      return sortOrder === 'asc'
        ? priorities[a.priority] - priorities[b.priority]
        : priorities[b.priority] - priorities[a.priority];
    }
    
    return sortOrder === 'asc'
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container maxWidth="md">
        <Paper className="text-center mb-8 p-6">
          <Typography variant="h3" component="h1" gutterBottom>
            Task Manager
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Organize your tasks efficiently
          </Typography>
        </Paper>

        <TaskForm />

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="space-x-2">
            <Button
              variant={filter === 'all' ? 'contained' : 'outlined'}
              onClick={() => dispatch(setFilter('all'))}
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'contained' : 'outlined'}
              onClick={() => dispatch(setFilter('active'))}
            >
              Active
            </Button>
            <Button
              variant={filter === 'completed' ? 'contained' : 'outlined'}
              onClick={() => dispatch(setFilter('completed'))}
            >
              Completed
            </Button>
          </div>

          <div className="flex space-x-4">
            <Select
              size="small"
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as 'dueDate' | 'priority' | 'createdAt'))}
            >
              <MenuItem value="createdAt">Sort by Date Created</MenuItem>
              <MenuItem value="dueDate">Sort by Due Date</MenuItem>
              <MenuItem value="priority">Sort by Priority</MenuItem>
            </Select>

            <IconButton 
              onClick={() => dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'))}
            >
              <SwapVert />
            </IconButton>
          </div>
        </div>

        {sortedTasks.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center" className="py-12">
            No tasks found
          </Typography>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Index;
