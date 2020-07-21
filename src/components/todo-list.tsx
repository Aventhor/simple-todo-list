import React, { useState } from "react";
import TodoItem, { ITodoItem } from "./todo-item";
import NewTaskDialog from "./new-task-dialog";
import { Button, Col } from "react-bootstrap";

const MAX_NESTING = 3;

export const TodoList = () => {
    const [tasks, setTasks] = useState<ITodoItem[]>([] as ITodoItem[]);
    const [showModal, setModalShow] = useState(false);

    const handleAddTask = (task: ITodoItem) => {
        setTasks(updateTasks(tasks, task.parentElementId, "add", task));
    };

    const handleDeleteTask = (taskId: number) => {
        const conf = confirm("Вы уверены, что хотите удалить элемент?");

        if (conf) {
            setTasks(updateTasks(tasks, taskId, "delete"));
        }
    };

    const updateTasks = (
        tasks: ITodoItem[],
        taskId: number,
        action?: "add" | "delete" | "update",
        task?: ITodoItem,
        checked?: boolean,
        nestingCount?: number
    ): ITodoItem[] => {
        if (nestingCount !== undefined && nestingCount >= MAX_NESTING) {
            return [] as ITodoItem[];
        }

        if (
            action === "add" &&
            task !== undefined &&
            task.parentElementId === 0
        ) {
            tasks.push(task);
            return tasks;
        }

        const updatedTasks = tasks.filter((el) => {
            if (el.id === taskId) {
                if (action === "update" && checked !== undefined) {
                    el.isCompleted = checked;
                }

                if (action === "delete") return false;

                if (
                    action === "add" &&
                    task !== undefined &&
                    task.parentElementId !== 0 &&
                    el.id === task.parentElementId
                ) {
                    el.subTasks.push(task);
                }
            }

            if (el.subTasks.length)
                el.subTasks = updateTasks(
                    el.subTasks,
                    taskId,
                    action,
                    task,
                    checked,
                    nestingCount !== undefined ? nestingCount + 1 : 0
                );

            return true;
        }) as ITodoItem[];

        updatedTasks.sort((a, b) =>
            a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1
        );

        return updatedTasks;
    };

    const handleChangeTaskStatus = (taskId: number, checked: boolean) => {
        setTasks(updateTasks(tasks, taskId, "update", undefined, checked));
    };

    const renderTodoItems = (tasks: ITodoItem[]) => {
        return tasks.map((item) => {
            return (
                <li className="todo-list__item-container" key={item.id}>
                    <TodoItem
                        todoItem={item}
                        onDelete={() => handleDeleteTask(item.id)}
                        onChangeStatus={handleChangeTaskStatus}
                    />
                    {item.subTasks.length > 0 && (
                        <ul>{renderTodoItems(item.subTasks)}</ul>
                    )}
                </li>
            );
        });
    };

    return (
        <Col xs={12} className="todo-list__wrapper">
            <h2>Todo list</h2>
            <Button onClick={() => setModalShow(true)}>Добавить задачу</Button>
            <ul className="todo-list">{renderTodoItems(tasks)}</ul>

            <NewTaskDialog
                show={showModal}
                tasks={tasks}
                maxNestedCount={MAX_NESTING}
                onClose={() => setModalShow(false)}
                onSave={handleAddTask}
            />
        </Col>
    );
};

export default TodoList;
