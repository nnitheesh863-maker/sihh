# Production Cloud Deployment Guide

## 1. Cloud Architecture on AWS
- **Frontend**: AWS S3 + CloudFront CDN (Global Edge Caching).
- **Backend API**: AWS ECS Fargate or EC2 (t4g.large) behind Application Load Balancer (ALB).
- **AI Microservice**: AWS EC2 g5.xlarge (Nvidia A10G GPU) with TensorRT acceleration.
- **Database**: AWS RDS PostgreSQL (Multi-AZ) or Supabase Managed Postgres.
- **Object Storage**: AWS S3 with Lifecycle Rules (Grading raw images transition to Glacier after 90 days).

## 2. Docker Compose Deployment
To run all services with one command in production:
```bash
docker compose -f docker-compose.yml up -d --build
```
