# Cron Scheduler and Workflow Orchestration: Quartz vs Temporal


## Quartz Join Scheduler (In-Process Scheduler)

This is an in-process scheduler designed for lightweight job execution within Java applications.

Currently, Quartz Join Scheduler supports Java only. However, for NodeJS/NestJS applications, there are libraries with Quartz-like behavior. In this Proof of Concept (POC), the `@nestjs/schedule` package was used to implement scheduling in a NestJS application.

### Service Injection for Scheduled Jobs

A service is used to inject the schedule logic, where two methods are defined:

- **First method**: Executes daily at 11:00 AM (server local time).
- **Second method**: Executes daily at 11:05 AM (server local time).

The logs confirmed both scheduled executions worked as expected.

### Pros and Cons

#### Pros

- Simple and easy to set up.
- Ideal for straightforward use cases.
- Works well for systems with minimal complexity.

#### Cons

- Lacks built-in support for:
  - Retries
  - Workflow states
  - Dependency chaining
- Manual implementation is required for advanced features.

**Recommendation**: This approach is best suited for applications that do not require complex scheduling, reliability, or orchestration.

---

## Temporal – Distributed Workflow Orchestration

Temporal is an open-source, distributed, and durable workflow engine designed for microservice orchestration, fault tolerance, and long-running workflows.

### Features

Built-in support for:

- Health monitoring
- Retry mechanisms
- Workflow state persistence
- Audit trails
- Workflow versioning
- Task scheduling and chaining

### Config File

In the codebase, define a config file to connect to Temporal’s exposed port and other data such as the task queue for retrieving and executing workflows.

Workflows are configured with timeouts for task execution. Example: a timeout of 45 seconds is set for an activity, after which it will retry.

Workers define the actual logic (e.g., modify user data). These actions are triggered by scheduled workflows via task queues.

---

### Docker Compose Setup

Two services are needed:

- **Worker**: Defines how the logic is executed (business logic).
- **Workflow**: Defines what logic should run and when (e.g., cron schedule).

They are chained together as best practice:

- **Workflow Example**: “Save user every minute.”
- **Worker**: Executes that logic.

**Note**: Without a Worker, the Workflow won’t run. Without a Workflow, the Worker won’t do anything useful.

---

### Timezone Consideration

**Important Note**: Temporal uses **UTC** time for cron scheduling.

Example:

- Local time: 17:50 (Vietnam Time, GMT+7)
- Convert to UTC: 10:50
- Set cron expression accordingly

---

### Worker + Workflow Initialization

After setting up everything and waiting until 17:50 (VN time), the job executed successfully per the workflow schedule (converted to UTC).

---

## Workflow ID Reuse Policy

The `workflowIdReusePolicy` config determines whether the same workflow ID can be reused.

### Example Scenario

- Schedule a workflow with ID `dailyJob` at 10:00 AM.
- Later, update the schedule to 5:00 PM using the same ID.
- **Result**: Both schedules will run. Temporal allows the same workflow ID to execute more than once per day unless configured otherwise.

---

## Temporal Databases

### 1. `temporal` Database (Core Persistence)

**Purpose**: Primary state store for Temporal. Holds critical information about workflow execution.

**What it stores**:

- Workflow state: Current state, variables, timers, child workflows
- Event history: Full execution history (e.g., workflow started, completed, timer fired)
- Task queues: Worker polling info
- Metadata: Internal Temporal data

**Importance**: Essential for Temporal's core functionality. If lost or corrupted, workflow state and history are also lost.

---

### 2. `temporal_visibility` Database (Workflow Visibility)

**Purpose**: Provides visibility into workflow state/history. Enables querying and listing executions.

**What it stores**:

- Workflow execution metadata:
  - Workflow ID, Run ID
  - Workflow type
  - Start/Close times
  - Status (Running, Completed, Failed, etc.)
  - Memo and search attributes

**Importance**:

- Monitoring via Web UI or API
- Debugging specific executions
- Auditing workflow outcomes
- Managing workflows by criteria

---
## Comparison: Quartz Scheduler vs Temporal

### Quartz Scheduler vs Temporal

🔹 **What**  
- **Quartz**: In-process, lightweight job scheduler  
- **Temporal**: Distributed, durable workflow engine

🔹 **Use Case**  
- **Quartz**: Simple time-based or periodic tasks  
- **Temporal**: Complex, long-running workflows with state and retries

🔹 **Fault Tolerance**  
- **Quartz**: Manual retry logic, no persistence  
- **Temporal**: Built-in retries, fault tolerance, durability

🔹 **Workflow Style**  
- **Quartz**: Job class + cron trigger  
- **Temporal**: Regular code, schedule via API

🔹 **Distributed**  
- **Quartz**: Limited support  
- **Temporal**: Fully supported

🔹 **Scalability**  
- **Quartz**: DB + clustering needed  
- **Temporal**: Natively scalable via workers

🔹 **Audit/History**  
- **Quartz**: Manual logging  
- **Temporal**: Full audit trail built-in

🔹 **Setup**  
- **Quartz**: Lightweight setup  
- **Temporal**: Requires Temporal server + DB

🔹 **Dev Experience**  
- **Quartz**: Minimal configuration  
- **Temporal**: Learning curve, but powerful orchestration

🔹 **Timezone**  
- **Quartz**: Local cron  
- **Temporal**: UTC cron (conversion needed)

---

✅ **Verdict: Which Tool to Use?**  
- **Quartz**: Simple scheduled tasks (e.g., reports, pings)  
- **Temporal**: Complex workflows, reliability, audit, retries  
- **Temporal**: Reporting with snapshot accuracy & resilience  
- **Quartz**: Quick POC with minimal setup
