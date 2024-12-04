import mongoose, { Document, Types } from "mongoose";
declare const taskStatus: {
    readonly PENDING: "pending";
    readonly ON_HOLD: "onHold";
    readonly IN_PROGRESS: "inProgress";
    readonly UNDER_REVIEW: "underReview";
    readonly COMPLETED: "completed";
};
export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];
export interface ITask extends Document {
    name: string;
    description: string;
    project: Types.ObjectId;
    status: TaskStatus;
    completedBy: {
        user: Types.ObjectId;
        status: TaskStatus;
    }[];
    notes: Types.ObjectId[];
}
export declare const TaskSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    description: string;
    name: string;
    status: "pending" | "onHold" | "inProgress" | "underReview" | "completed";
    completedBy: Types.DocumentArray<{
        status: "pending" | "onHold" | "inProgress" | "underReview" | "completed";
        user: {
            prototype?: Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }>;
    notes: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    }[];
    project?: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    description: string;
    name: string;
    status: "pending" | "onHold" | "inProgress" | "underReview" | "completed";
    completedBy: Types.DocumentArray<{
        status: "pending" | "onHold" | "inProgress" | "underReview" | "completed";
        user: {
            prototype?: Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }>;
    notes: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    }[];
    project?: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    description: string;
    name: string;
    status: "pending" | "onHold" | "inProgress" | "underReview" | "completed";
    completedBy: Types.DocumentArray<{
        status: "pending" | "onHold" | "inProgress" | "underReview" | "completed";
        user: {
            prototype?: Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }>;
    notes: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    }[];
    project?: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const Task: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask> & ITask & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Task;
