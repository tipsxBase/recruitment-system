# 招聘系统完整业务流程图

## 1. 系统整体架构图

```mermaid
graph TB
    subgraph "系统层级"
        SA[超级管理员<br/>SUPER_ADMIN]

        subgraph "组织A"
            OA1[组织管理员A]
            subgraph "部门A1"
                DLA1[部门负责人A1]
                UA1[用户A1]
                UA2[用户A2]
            end
            subgraph "部门A2"
                DLA2[部门负责人A2]
                UA3[用户A3]
            end
            HRA[HR专员A]
            IA[面试官A]
        end

        subgraph "组织B"
            OA2[组织管理员B]
            subgraph "部门B1"
                DLB1[部门负责人B1]
                UB1[用户B1]
            end
            HRB[HR专员B]
            IB[面试官B]
        end
    end

    SA --> OA1
    SA --> OA2
    OA1 --> DLA1
    OA1 --> DLA2
    OA1 --> HRA
    OA1 --> IA
    DLA1 --> UA1
    DLA1 --> UA2
    DLA2 --> UA3
```

## 2. 系统初始化流程

```mermaid
flowchart TD
    A[系统启动] --> B{是否已初始化?}
    B -->|否| C[显示初始化页面]
    B -->|是| D[显示登录页面]

    C --> E[超级管理员注册]
    E --> F[创建内置角色和权限]
    F --> G[系统初始化完成]
    G --> D

    D --> H[用户登录]
    H --> I{有多个组织?}
    I -->|是| J[选择/切换组织]
    I -->|否| K[进入系统首页]
    J --> K
```

## 3. 组织和用户管理流程

```mermaid
flowchart TD
    subgraph "超级管理员操作"
        A[创建组织] --> B[指定组织管理员]
        B --> C[组织激活]
    end

    subgraph "组织管理员操作"
        D[创建部门结构] --> E[邀请用户加入组织]
        E --> F[分配用户角色]
        F --> G[分配用户部门]
    end

    subgraph "用户响应"
        H[收到邀请通知] --> I{接受邀请?}
        I -->|是| J[加入组织]
        I -->|否| K[拒绝邀请]
        J --> L[获得组织权限]
    end

    C --> D
    E --> H
```

## 4. 完整招聘业务流程

```mermaid
flowchart TD
    subgraph "岗位管理阶段"
        A[HR创建岗位] --> B[设置岗位信息<br/>部门/JD/人数等]
        B --> C[岗位发布<br/>状态:OPEN]
    end

    subgraph "候选人录入阶段"
        D[HR录入候选人] --> E[填写候选人信息<br/>关联岗位和部门]
        E --> F[上传简历附件]
        F --> G[候选人状态: NEW]
    end

    subgraph "评估流程阶段"
        G --> H[HR发起评估流程<br/>状态: ASSESSMENT_PENDING]
        H --> I[部门负责人收到待办]
        I --> J{选择评估方式}

        J -->|自己评估| K[自评模式<br/>状态: SELF_ASSESSING]
        J -->|分配他人| L[指定评估人<br/>状态: ASSIGNED]

        K --> M[部门负责人执行评估]
        L --> N[评估人收到待办]
        N --> O[评估人执行评估<br/>状态: IN_PROGRESS]

        M --> P[提交评估结果<br/>状态: COMPLETED]
        O --> Q[提交评估结果<br/>状态: COMPLETED]

        Q --> R[部门负责人确认结果]
        P --> S{评估结果}
        R --> S

        S -->|通过| T[状态: ASSESSMENT_APPROVED]
        S -->|不通过| U[状态: ASSESSMENT_REJECTED<br/>流程结束]
    end

    subgraph "面试流程阶段"
        T --> V[HR安排面试<br/>状态: INTERVIEWING]
        V --> W[创建面试轮次]
        W --> X[分配面试官]
        X --> Y[面试官收到待办]

        Y --> Z[面试官执行面试]
        Z --> AA[提交面试反馈]
        AA --> BB{所有轮次完成?}

        BB -->|否| CC[下一轮面试]
        CC --> X
        BB -->|是| DD{面试结果}

        DD -->|通过| EE[状态: OFFERED]
        DD -->|不通过| FF[状态: REJECTED]
    end

    C --> D
```

## 5. 评估流程详细图

```mermaid
flowchart TD
    A[HR发起评估] --> B[创建AssessmentProcess<br/>status: PENDING]
    B --> C[为部门负责人创建待办<br/>type: ASSESSMENT_ASSIGN]

    C --> D[部门负责人登录]
    D --> E[查看待办事项]
    E --> F{选择评估方式}

    F -->|选择自己评估| G[更新status: SELF_ASSESSING<br/>isSelfAssessment: true<br/>assessorId: 部门负责人ID]
    F -->|选择分配他人| H[选择评估人<br/>更新status: ASSIGNED<br/>isSelfAssessment: false<br/>assessorId: 评估人ID]

    G --> I[完成ASSIGN待办<br/>创建EXECUTE待办给自己]
    H --> J[完成ASSIGN待办<br/>创建EXECUTE待办给评估人]

    I --> K[部门负责人执行评估]
    J --> L[评估人执行评估]

    K --> M[创建DepartmentAssessment<br/>更新status: COMPLETED]
    L --> N[创建DepartmentAssessment<br/>更新status: COMPLETED]

    M --> O{是否自评?}
    N --> P[为部门负责人创建CONFIRM待办]

    O -->|是| Q[直接确认结果<br/>status: APPROVED/REJECTED]
    O -->|否| P

    P --> R[部门负责人确认]
    R --> S[更新status: APPROVED/REJECTED<br/>更新候选人状态]
    Q --> T[更新候选人状态]
    S --> T
```

## 6. 面试流程详细图

```mermaid
flowchart TD
    A[HR创建面试] --> B[创建Interview主表<br/>status: SCHEDULED]
    B --> C[创建InterviewTask子表<br/>分配面试官]
    C --> D[为面试官创建待办<br/>type: INTERVIEW_EXECUTE]

    D --> E[面试官查看待办]
    E --> F[面试官开始面试<br/>task status: IN_PROGRESS]
    F --> G[更新Interview主表<br/>status: IN_PROGRESS]

    G --> H[面试官执行面试]
    H --> I[提交面试反馈<br/>task status: COMPLETED]
    I --> J{所有task都完成?}

    J -->|否| K[等待其他面试官]
    J -->|是| L[更新Interview主表<br/>status: COMPLETED]

    L --> M{是否最后一轮?}
    M -->|否| N[HR安排下一轮面试]
    M -->|是| O[根据反馈决定最终结果]

    N --> A
    O --> P[更新候选人最终状态<br/>OFFERED/REJECTED]
```

## 7. 待办事项流转图

```mermaid
flowchart TD
    subgraph "评估相关待办"
        A[ASSESSMENT_ASSIGN<br/>部门负责人分配评估人] --> B[ASSESSMENT_EXECUTE<br/>评估人执行评估]
        B --> C[ASSESSMENT_CONFIRM<br/>部门负责人确认结果]
    end

    subgraph "面试相关待办"
        D[INTERVIEW_EXECUTE<br/>面试官执行面试] --> E[INTERVIEW_FEEDBACK<br/>面试官提交反馈]
    end

    subgraph "其他待办"
        F[ORGANIZATION_INVITATION<br/>响应组织邀请]
    end

    subgraph "待办状态流转"
        G[PENDING] --> H[IN_PROGRESS]
        H --> I[COMPLETED]
        H --> J[CANCELLED]
    end
```

## 8. 候选人状态流转图

```mermaid
stateDiagram-v2
    [*] --> NEW : HR录入候选人

    NEW --> ASSESSMENT_PENDING : HR发起评估
    ASSESSMENT_PENDING --> ASSESSMENT_ASSIGNED : 部门负责人分配评估人
    ASSESSMENT_PENDING --> ASSESSMENT_IN_PROGRESS : 部门负责人自评
    ASSESSMENT_ASSIGNED --> ASSESSMENT_IN_PROGRESS : 评估人开始评估

    ASSESSMENT_IN_PROGRESS --> ASSESSMENT_COMPLETED : 提交评估结果
    ASSESSMENT_COMPLETED --> ASSESSMENT_APPROVED : 部门负责人确认通过
    ASSESSMENT_COMPLETED --> ASSESSMENT_REJECTED : 部门负责人确认不通过

    ASSESSMENT_APPROVED --> INTERVIEWING : HR安排面试
    INTERVIEWING --> OFFERED : 面试通过
    INTERVIEWING --> REJECTED : 面试不通过

    ASSESSMENT_REJECTED --> [*] : 流程结束
    OFFERED --> [*] : 录用成功
    REJECTED --> [*] : 流程结束
```

## 9. 权限控制流程图

```mermaid
flowchart TD
    A[用户请求接口] --> B[验证JWT Token]
    B --> C{Token有效?}
    C -->|否| D[返回401未认证]
    C -->|是| E[解析用户信息和组织上下文]

    E --> F[获取用户角色和权限]
    F --> G[检查接口权限要求]
    G --> H{权限匹配?}
    H -->|否| I[返回403权限不足]
    H -->|是| J[检查数据权限]

    J --> K{数据访问权限?}
    K -->|否| L[返回403权限不足]
    K -->|是| M[执行业务逻辑]
    M --> N[返回结果]
```

## 10. 数据权限控制图

```mermaid
graph TD
    subgraph "数据访问控制"
        A[超级管理员] --> B[所有数据]

        C[组织管理员] --> D[本组织所有数据]

        E[部门负责人] --> F[本部门及下级部门数据]

        G[HR专员] --> H[本组织招聘相关数据]

        I[面试官] --> J[分配给自己的面试数据]

        K[普通用户] --> L[个人相关数据]
    end

    subgraph "数据过滤规则"
        M[请求数据] --> N{用户角色?}
        N -->|超级管理员| O[不过滤]
        N -->|组织管理员| P[按组织过滤]
        N -->|部门负责人| Q[按部门层级过滤]
        N -->|HR专员| R[按组织+业务类型过滤]
        N -->|面试官| S[按分配关系过滤]
        N -->|普通用户| T[按用户ID过滤]
    end
```

## 11. 系统集成流程图

```mermaid
flowchart TD
    subgraph "前端应用"
        A[登录页面] --> B[选择组织]
        B --> C[系统首页]
        C --> D[业务模块]
    end

    subgraph "Gateway网关"
        E[请求路由] --> F[身份认证]
        F --> G[权限验证]
        G --> H[请求转发]
    end

    subgraph "后端服务"
        I[用户服务] --> J[组织服务]
        J --> K[招聘服务]
        K --> L[通知服务]
    end

    subgraph "数据存储"
        M[PostgreSQL数据库] --> N[文件存储]
        N --> O[缓存Redis]
    end

    D --> E
    H --> I
    I --> M
```

这个完整的业务流程图涵盖了：

1. **系统架构**：多组织、多层级的用户管理
2. **初始化流程**：系统冷启动和基础数据创建
3. **组织管理**：组织创建、用户邀请、角色分配
4. **招聘流程**：从岗位创建到候选人录用的完整流程
5. **评估流程**：部门评估的详细步骤和状态流转
6. **面试流程**：多轮面试的管理和执行
7. **待办事项**：基于业务流程的任务管理
8. **状态流转**：候选人状态的完整生命周期
9. **权限控制**：请求级别和数据级别的权限验证
10. **系统集成**：前后端交互和服务架构

每个流程图都详细展示了各个角色的职责、操作步骤和系统响应，可以作为开发和测试的重要参考。
