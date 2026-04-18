# 使用 pnpm 迁移说明（ModuChat frontend）

目的：使用 `pnpm` 的全局 store 来减少多项目之间重复的 node_modules，节省磁盘。

不要直接修改系统用户变量或环境变量。本说明仅给出安全操作步骤与可选命令。

## 迁移前准备（只读步骤）
1. 在项目根（包含 `package.json` 的目录）打开 PowerShell。确保你在 `doubao/ModuChat/frontend`。
2. 查看当前依赖与锁文件：

```powershell
Get-ChildItem -Name package.json, package-lock.json, pnpm-lock.yaml
```

## 迁移步骤（推荐）
1. 安装 pnpm（若未安装）。推荐两种方式：
   - 使用 corepack（Node 16+，更安全）：

```powershell
corepack enable
corepack prepare pnpm@latest --activate
```

   - 或使用 npm 全局安装：

```powershell
npm install -g pnpm
```

2. 运行迁移脚本（预览模式，默认不改动）：

```powershell
.\migrate-to-pnpm.ps1
```

3. 确认预览步骤无误后，执行真实迁移（会删除 `node_modules` 和 `package-lock.json`）：

```powershell
.\migrate-to-pnpm.ps1 -Force
```

脚本会：
- 如果存在 `package-lock.json`，先运行 `pnpm import` 生成 `pnpm-lock.yaml`；
- 删除 `node_modules` 与 `package-lock.json`（仅在 `-Force` 时）；
- 运行 `pnpm install`，生成 `pnpm-lock.yaml` 并使用 pnpm store。

## 迁移后建议
- 把 `pnpm-lock.yaml` 提交到仓库以保证可复现。`package-lock.json` 可以删除或保留（但注意冲突）。
- 在项目 README 中注明使用 pnpm（或者在仓库根放一个迁移指南）。
- 清理本地旧缓存（可选）：

```powershell
pnpm store prune
```

- 若需还原为 npm：保留原 `package.json`，运行 `npm install`（需注意可能会产生差异）。

## 为什么用 pnpm
- pnpm 通过全局 store 和硬链接/符号链接机制共享包，多个项目可以共享相同的包文件，从而显著减少磁盘占用。详情见官方文档：https://pnpm.io/

## 验证
- 检查安装是否成功：

```powershell
pnpm --version
pnpm store path    # 显示全局 store 路径
```

- 启动项目（示例）：

```powershell
pnpm run dev
```

## 注意事项
- 本脚本不会自动安装 pnpm 或修改系统环境变量。
- 我不会在你的机器上更改用户/系统变量；若需要全局安装，请按上文命令手动执行。
- 任何删除操作（`node_modules`/`package-lock.json`）都只在你明确用 `-Force` 时发生。
