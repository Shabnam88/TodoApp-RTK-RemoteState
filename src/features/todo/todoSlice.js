import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  todos: [],
  error: "",
};

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const getAsyncTodos = createAsyncThunk(
  "todos/getAsyncTodos",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/todos");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addAsyncTodo = createAsyncThunk(
  "todos/addAsyncTodo",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/todos", {
        id: Date.now,
        title: payload.title,
        completed: false,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleAsyncTodo = createAsyncThunk(
  "todos/toggleAsyncTodo",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/todos/${payload.id}`, {
        completed: payload.completed,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteAsyncTodo = createAsyncThunk(
  "todos/deleteAsyncTodo",
  async (payload, { rejectWithValue }) => {
    try {
      await api.delete(`/todos/${payload.id}`);
      return payload.id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAsyncTodos.pending, (state) => {
        state.loading = true;
        state.todos = [];
        state.error = "";
      })
      .addCase(getAsyncTodos.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.todos = payload;
        state.error = "";
      })
      .addCase(getAsyncTodos.rejected, (state, { payload }) => {
        state.loading = false;
        state.todos = [];
        state.error = payload;
      })
      .addCase(addAsyncTodo.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(addAsyncTodo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.todos.push(payload);
      })
      .addCase(addAsyncTodo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(toggleAsyncTodo.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(toggleAsyncTodo.fulfilled, (state, { payload }) => {
        state.loading = false;
        const selected = state.todos.find(
          (todo) => todo.id === Number(payload.id)
        );
        selected.completed = payload.completed;
      })
      .addCase(toggleAsyncTodo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteAsyncTodo.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteAsyncTodo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.todos = state.todos.filter(
          (todo) => todo.id !== Number(payload.id)
        );
      })
      .addCase(deleteAsyncTodo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default todoSlice.reducer;
