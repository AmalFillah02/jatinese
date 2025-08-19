-- CreateTable
CREATE TABLE "public"."PayrollHistory" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "expenseId" INTEGER NOT NULL,

    CONSTRAINT "PayrollHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PayrollHistory_expenseId_key" ON "public"."PayrollHistory"("expenseId");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollHistory_employeeId_month_year_key" ON "public"."PayrollHistory"("employeeId", "month", "year");

-- AddForeignKey
ALTER TABLE "public"."PayrollHistory" ADD CONSTRAINT "PayrollHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PayrollHistory" ADD CONSTRAINT "PayrollHistory_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "public"."Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
