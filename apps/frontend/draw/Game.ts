import { getExistingShapes } from "./http";
import { Tool } from "@/components/Canvas";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      points: {
        x: number;
        y: number;
      }[];
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private currentPencilPoints: { x: number; y: number }[] = [];
  private router: any;
  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, router: any) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.router = router;
    this.init();
    this.initHandlers();
    this.initEventListeners();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("touchstart", this.touchStartHandler);
    this.canvas.removeEventListener("touchend", this.touchEndHandler);
    this.canvas.removeEventListener("touchmove", this.touchMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.error) {
        alert("Room does not exist");
        this.router.push("/dashboard");
      }
      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "rgba(255,255,255)"; 

    this.existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (shape.type === "pencil" && shape.points.length > 0) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        this.ctx.stroke();
      }
    });
  }

  private handleStart = (x: number, y: number) => {
    this.clicked = true;
    this.startX = x;
    this.startY = y;

    if (this.selectedTool === "pencil") {
      this.currentPencilPoints = [{ x: this.startX, y: this.startY }];
    }
  };

  private handleMove = (x: number, y: number) => {
    if (!this.clicked) return;

    this.clearCanvas(); // Redraw existing shapes first
    this.ctx.strokeStyle = "rgba(255,255,255)";

    const width = x - this.startX;
    const height = y - this.startY;

    if (this.selectedTool === "rect") {
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } else if (this.selectedTool === "circle") {
      const radius = Math.sqrt(width ** 2 + height ** 2);
      this.ctx.beginPath();
      this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    } else if (this.selectedTool === "pencil") {
      this.currentPencilPoints.push({ x, y });
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
      for (let i = 1; i < this.currentPencilPoints.length; i++) {
          this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
      }
      this.ctx.stroke();
    }
  };

  private handleEnd = (x: number, y: number) => {
    if (!this.clicked) return;
    this.clicked = false;
    
    let shape: Shape | null = null;
    const width = x - this.startX;
    const height = y - this.startY;
    
    switch (this.selectedTool) {
      case "rect":
        shape = { type: "rect", x: this.startX, y: this.startY, width, height };
        break;
      case "circle":
        const radius = Math.sqrt(width ** 2 + height ** 2);
        shape = { type: "circle", centerX: this.startX, centerY: this.startY, radius };
        break;
      case "pencil":
        shape = { type: "pencil", points: [...this.currentPencilPoints] };
        this.currentPencilPoints = [];
        break;
    }

    if (shape) {
      this.existingShapes.push(shape);
      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId: this.roomId,
        })
      );
      this.clearCanvas();
    }
  };

  private mouseDownHandler = (e: MouseEvent) => {
    this.handleStart(e.offsetX, e.offsetY);
  };
  private mouseMoveHandler = (e: MouseEvent) => {
    this.handleMove(e.offsetX, e.offsetY);
  };
  private mouseUpHandler = (e: MouseEvent) => {
    this.handleEnd(e.offsetX, e.offsetY);
  };
  
  private touchStartHandler = (e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.handleStart(touch.clientX - rect.left, touch.clientY - rect.top);
  };
  private touchMoveHandler = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
  };
  private touchEndHandler = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.handleEnd(touch.clientX - rect.left, touch.clientY - rect.top);
  };
  
  initEventListeners() {
    // Mouse events
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);

    // Touch events
    this.canvas.addEventListener("touchstart", this.touchStartHandler);
    this.canvas.addEventListener("touchend", this.touchEndHandler);
    this.canvas.addEventListener("touchmove", this.touchMoveHandler);
  }
}