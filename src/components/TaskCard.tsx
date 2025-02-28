import { useState, useSyncExternalStore } from "react";
import { useDispatch } from "react-redux";
import { Task, deleteTask, editTask, toggleTask } from "../store/taskSlice";
import {
  Paper,
  Typography,
  IconButton,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AlertDialog from "./AlertDialogue";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || "");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleSave = () => {
    if (editTitle.length < 3) {
      alert("Title must be at least 3 characters");
      return;
    }

    dispatch(
      editTask({
        id: task.id,
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        dueDate: editDueDate || null,
      })
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      default:
        return "info";
    }
  };

  if (isEditing) {
    return (
      <>
        <Paper className="p-4 mb-4">
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <div className="flex space-x-4">
              <Select
                fullWidth
                value={editPriority}
                onChange={(e) =>
                  setEditPriority(e.target.value as "low" | "medium" | "high")
                }
              >
                <MenuItem value="low">Low Priority</MenuItem>
                <MenuItem value="medium">Medium Priority</MenuItem>
                <MenuItem value="high">High Priority</MenuItem>
              </Select>

              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                focused
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </Paper>
        <AlertDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={() => {
            dispatch(deleteTask(task.id));
            setOpenDialog(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <Paper className={`p-4 mb-4 ${task.completed ? "opacity-75" : ""}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={task.completed}
                onChange={() => dispatch(toggleTask(task.id))}
              />
              <Typography
                variant="h6"
                className={task.completed ? "line-through text-gray-500" : ""}
              >
                {task.title}
              </Typography>
              <Chip
                label={task.priority}
                color={getPriorityColor(task.priority)}
                size="small"
              />
            </div>

            <Typography variant="body2" color="textSecondary" className="mt-2">
              {task.description}
            </Typography>

            {task.dueDate && (
              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-2"
              >
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            )}
          </div>

          <div>
            <IconButton onClick={() => setIsEditing(true)} size="small">
              <Edit fontSize="small" />
            </IconButton>
            <IconButton onClick={handleDelete} size="small" color="error">
              <Delete fontSize="small" />
            </IconButton>
          </div>
        </div>
      </Paper>
      <AlertDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => {
          dispatch(deleteTask(task.id));
          setOpenDialog(false);
        }}
      />
    </>
  );
};
