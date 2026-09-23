# AI Computer Vision Pipeline

## 1. Defect Classes
| Class ID | Defect Name | Visual Signature | Severity |
|---|---|---|---|
| 0 | `healthy` | Uniform dry outer tunic, firm neck | None |
| 1 | `black_mold` | Black powdery patches (*Aspergillus niger*) | Critical (Reject) |
| 2 | `neck_rot` | Soft, watery neck tissue (*Botrytis allii*) | Critical (Reject) |
| 3 | `sprouted` | Emergence of green shoot from apical bud | High (Grade C/Reject) |
| 4 | `skin_crack` | Longitudinal rupture of outer protective tunic | Medium (Grade B/C) |
| 5 | `double_bulb` | Two or more cloves forming under single skin | Low (Grade B/C) |
| 6 | `sun_scald` | Bleached papery white patches from sun exposure | Medium (Grade B) |

## 2. Size Estimation Pipeline
1. **Reference Scale Calibration**: Automated detection of ArUco marker or conveyor belt width grid.
2. **Convex Hull & Minimum Area Rectangle**: Extracting major axis (diameter) and minor axis in millimeters with ±1.5mm precision.
3. **Weight Estimation**: Regression model mapping volume $(4/3 pi r_a r_b r_c)$ and bulb density $(ho approx 0.98 	ext{ g/cm}^3)$ to grams.
