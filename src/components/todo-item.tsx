import React from "react";
import { Button, Form } from "react-bootstrap";

export interface ITodoItem {
    id: number;
    name: string;
    parentElementId: number;
    isCompleted: boolean;
    subTasks: ITodoItem[];
}

interface Props {
    todoItem: ITodoItem;
    onDelete: (taskId: number) => void;
    onChangeStatus: (taskId: number, checked: boolean) => void;
}

export default function TodoItem(props: Props) {
    return (
        <div key={props.todoItem.id} className="todo-list__todo-item">
            <Form.Check
                type="checkbox"
                onChange={(e: any) =>
                    props.onChangeStatus(props.todoItem.id, e.target.checked)
                }
            ></Form.Check>
            <h4 className={`${props.todoItem.isCompleted && "text-through"}`}>
                {props.todoItem.name}
            </h4>
            {props.todoItem.isCompleted && (
                <Button
                    onClick={() => props.onDelete(props.todoItem.id)}
                    size="sm"
                >
                    Удалить
                </Button>
            )}
        </div>
    );
}
