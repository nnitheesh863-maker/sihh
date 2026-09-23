# IoT Hardware Sorting & Edge Camera Integration

## 1. Hardware Architecture
```
[ Industrial Camera (Sony IMX477 / Basler) ] ── (GigE / USB3) ──> [ Edge Compute (Nvidia Jetson Orin Nano) ]
                                                                                │
                                                                       (GPIO / Modbus RS485)
                                                                                │
                                                                                ▼
[ Pneumatic Actuator Array ] ◄─── [ Solenoid Drivers ] ◄─── [ ESP32 / Arduino PLC Controller ]
   (Flap 1: Grade A)
   (Flap 2: Grade B)
   (Flap 3: Grade C)
   (Flap 4: Reject)
```

## 2. Timing & Synchronization
- Conveyor Speed: 0.8 meters/second.
- Optical Sensor to Actuator Distance: 450 mm.
- Time of Flight: $450 / 800 = 562.5 	ext{ ms}$.
- AI Inference Latency: $le 35 	ext{ ms}$.
- Actuation Window: $520 	ext{ ms} pm 15 	ext{ ms}$ pulse trigger.
