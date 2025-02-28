
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/taskSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Paper, Snackbar, Alert } from '@mui/material';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be less than 50 characters'),
  description: Yup.string()
    .max(200, 'Description must be less than 200 characters'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'] as const, 'Invalid priority')
    .required('Priority is required'),
  dueDate: Yup.date()
    .min(new Date(), 'Due date cannot be in the past')
    .nullable(),
});

export const TaskForm = () => {
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium' as 'low' | 'medium' | 'high',
      dueDate: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(addTask({
        title: values.title.trim(),
        description: values.description.trim(),
        completed: false,
        priority: values.priority,
        dueDate: values.dueDate || null,
      }));

      resetForm();
      setShowSuccess(true);
    },
  });

  return (
    <>
      <Paper className="p-6 mb-8">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            name="title"
            label="What needs to be done?"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            name="description"
            label="Add a description (optional)"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          <div className="flex space-x-4">
            <FormControl fullWidth error={formik.touched.priority && Boolean(formik.errors.priority)}>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formik.values.priority}
                label="Priority"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="low">Low Priority</MenuItem>
                <MenuItem value="medium">Medium Priority</MenuItem>
                <MenuItem value="high">High Priority</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              name="dueDate"
              label="Due Date"
              value={formik.values.dueDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
              helperText={formik.touched.dueDate && formik.errors.dueDate}
              focused
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
          >
            Add Task
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success">
          Task added successfully
        </Alert>
      </Snackbar>
    </>
  );
};
