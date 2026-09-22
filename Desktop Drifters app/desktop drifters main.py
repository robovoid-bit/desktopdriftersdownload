import tkinter as tk
import math

class DesktopGooseDrifter:
    def __init__(self):
        self.root = tk.Tk()
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        self.root.attributes("-transparentcolor", "black")
        
        self.width = 60
        self.height = 60
        
        # Spawn positions at center screen
        self.car_x = self.root.winfo_screenwidth() // 2
        self.car_y = self.root.winfo_screenheight() // 2
        
        self.target_x = self.car_x
        self.target_y = self.car_y
        
        # Optimized movement tracking speeds
        self.target_speed = 6.0       
        self.car_follow_rate = 0.16    
        
        # The angle offset depth (Controls the drift sharpness)
        self.drift_depth = 0.40 
        
        self.angle = 0
        self.orbit_angle = 0
        self.mouse_still_timer = 0
        
        self.last_mouse_x = self.root.winfo_pointerx()
        self.last_mouse_y = self.root.winfo_pointery()
        
        self.canvas = tk.Canvas(self.root, width=self.width, height=self.height, bg="black", highlightthickness=0)
        self.canvas.pack()
        
        self.root.bind("<Escape>", lambda e: self.root.destroy())
        self.update_loop()
        self.root.mainloop()

    def update_loop(self):
        mx = self.root.winfo_pointerx()
        my = self.root.winfo_pointery()

        # --- 1. TRACK TARGET INTERPOLATIONS ---
        if mx != self.last_mouse_x or my != self.last_mouse_y:
            is_moving = True
            self.mouse_still_timer = 0
            self.last_mouse_x = mx
            self.last_mouse_y = my
            goal_x = mx
            goal_y = my
        else:
            self.mouse_still_timer += 1
            is_moving = self.mouse_still_timer < 10
            
            # Locked orbit pathing loops
            self.orbit_angle += 0.06
            goal_x = mx + math.cos(self.orbit_angle) * 70
            goal_y = my + math.sin(self.orbit_angle) * 70

        tg_dx = goal_x - self.target_x
        tg_dy = goal_y - self.target_y
        tg_dist = math.hypot(tg_dx, tg_dy)

        if tg_dist > 5:
            step_x = (tg_dx / tg_dist) * self.target_speed
            step_y = (tg_dy / tg_dist) * self.target_speed
            
            if tg_dist < self.target_speed:
                self.target_x = goal_x
                self.target_y = goal_y
            else:
                self.target_x += step_x
                self.target_y += step_y

        # --- 2. TRANSLATE CAR AXIS ---
        self.car_x += (self.target_x - self.car_x) * self.car_follow_rate
        self.car_y += (self.target_y - self.car_y) * self.car_follow_rate

        # --- 3. FIX ANGULAR ALIGNMENT ---
        # Face directly toward the target destination vector
        car_dx = self.target_x - self.car_x
        car_dy = self.target_y - self.car_y
        
        if math.hypot(car_dx, car_dy) > 1:
            base_heading = math.atan2(car_dy, car_dx)
            
            if not is_moving:
                # When circling, use the current orbital phase sin value to cleanly 
                # invert the offset direction for perfect left/right counter steering balance!
                direction_modifier = 1 if math.sin(self.orbit_angle) > 0 else -1
                self.angle = base_heading - (self.drift_depth * direction_modifier)
            else:
                # If chasing directly, scale visual angle gently toward your actual cursor coordinate points
                mouse_heading = math.atan2(my - self.car_y, mx - self.car_x)
                self.angle = (base_heading * 0.4) + (mouse_heading * 0.6)

        # Draw box placement window boundaries
        window_x = int(self.car_x - self.width // 2)
        window_y = int(self.car_y - self.height // 2)
        self.root.geometry(f"{self.width}x{self.height}+{window_x}+{window_y}")

        # --- 4. RENDER VISUAL LAYER ---
        self.canvas.delete("all")
        
        cx, cy = self.width / 2, self.height / 2
        cos_a = math.cos(self.angle)
        sin_a = math.sin(self.angle)

        def rotate_point(px, py):
            dx, py_diff = px - cx, py - cy
            nx = cx + (dx * cos_a - py_diff * sin_a)
            ny = cy + (dx * sin_a + py_diff * cos_a)
            return nx, ny

        p1 = rotate_point(15, 20)
        p2 = rotate_point(45, 20)
        p3 = rotate_point(45, 40)
        p4 = rotate_point(15, 40)
        self.canvas.create_polygon(p1, p1, p2, p2, p3, p3, p4, p4, fill="#3250FF", outline="")

        w1 = rotate_point(33, 23)
        w2 = rotate_point(40, 23)
        w3 = rotate_point(40, 37)
        w4 = rotate_point(33, 37)
        self.canvas.create_polygon(w1, w1, w2, w2, w3, w3, w4, w4, fill="#111111", outline="")

        self.root.after(16, self.update_loop)

if __name__ == "__main__":
    DesktopGooseDrifter()
