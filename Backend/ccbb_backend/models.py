from django.db import models

# REMINDER! Add all model fields to serializer.


class Warehouse(models.Model):
    warehouse_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    manual = models.BooleanField()
    path = models.CharField(max_length=100, blank=True, default="")
    abc_code_path = models.CharField(max_length=100, blank=True, default="")
    cycles_per_year = models.IntegerField(blank=True, default=0)


class Transaction(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    part_number = models.CharField(max_length=100)
    old_location = models.CharField(max_length=100)
    new_location = models.CharField(max_length=100)
    quantity = models.FloatField(max_length=100)
    date = models.DateField()
    executed = models.BooleanField()
    warehouse_id = models.ForeignKey(Warehouse, on_delete=models.CASCADE)


class Cycle(models.Model):
    cycle_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    date = models.DateField()
    asignee = models.CharField(max_length=100, blank=True, default="")
    completed = models.BooleanField(default=False)
    warehouse_id = models.ForeignKey(Warehouse, on_delete=models.CASCADE)


class PastCycle(models.Model):
    past_cycle_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    date_completed = models.DateField()
    asignee = models.CharField(max_length=100, blank=True, default="")
    bin_list = models.JSONField(encoder=None, decoder=None, default=list)
    warehouse_id = models.ForeignKey(Warehouse, on_delete=models.CASCADE)


class Bin(models.Model):
    bin_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    cycle_id = models.ForeignKey(Cycle, on_delete=models.CASCADE)


class PresentPart(models.Model):
    present_part_id = models.AutoField(primary_key=True)
    number = models.CharField(max_length=100)
    quantity = models.FloatField(max_length=100)
    bin_id = models.ForeignKey(Bin, on_delete=models.CASCADE)


class SystemPart(models.Model):
    system_part_id = models.AutoField(primary_key=True)
    number = models.CharField(max_length=100)
    quantity = models.FloatField(max_length=100)
    bin_id = models.ForeignKey(Bin, on_delete=models.CASCADE)


class PhysicallyMissingPart(models.Model):
    physically_missing_part_id = models.AutoField(primary_key=True)
    number = models.CharField(max_length=100)
    quantity = models.FloatField(max_length=100)
    location = models.CharField(max_length=100)
    date = models.DateField()
    bin_id = models.ForeignKey(Bin, on_delete=models.CASCADE)


class SystematicallyMissingPart(models.Model):
    systematically_missing_part_id = models.AutoField(primary_key=True)
    number = models.CharField(max_length=100)
    quantity = models.FloatField(max_length=100)
    location = models.CharField(max_length=100)
    date = models.DateField()
    bin_id = models.ForeignKey(Bin, on_delete=models.CASCADE)
