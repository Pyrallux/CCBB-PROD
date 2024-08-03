from rest_framework import serializers
from .models import (
    Warehouse,
    PhysicallyMissingPart,
    SystematicallyMissingPart,
    Transaction,
    Cycle,
    PastCycle,
    Bin,
    PresentPart,
    SystemPart,
)

# REMINDER! Setup Views For Serialized Models


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = [
            "warehouse_id",
            "name",
            "manual",
            "path",
            "abc_code_path",
            "cycles_per_year",
        ]


class TransactionSerializer(serializers.ModelSerializer):
    warehouse_id = serializers.PrimaryKeyRelatedField(queryset=Warehouse.objects.all())

    class Meta:
        model = Transaction
        fields = [
            "transaction_id",
            "part_number",
            "old_location",
            "new_location",
            "quantity",
            "date",
            "executed",
            "warehouse_id",
        ]


class CycleSerializer(serializers.ModelSerializer):
    warehouse_id = serializers.PrimaryKeyRelatedField(queryset=Warehouse.objects.all())

    class Meta:
        model = Cycle
        fields = ["cycle_id", "name", "date", "asignee", "completed", "warehouse_id"]


class PastCycleSerializer(serializers.ModelSerializer):
    warehouse_id = serializers.PrimaryKeyRelatedField(queryset=Warehouse.objects.all())

    class Meta:
        model = PastCycle
        fields = [
            "past_cycle_id",
            "name",
            "date_completed",
            "asignee",
            "bin_list",
            "warehouse_id",
        ]


class BinSerializer(serializers.ModelSerializer):
    cycle_id = serializers.PrimaryKeyRelatedField(queryset=Cycle.objects.all())

    class Meta:
        model = Bin
        fields = ["bin_id", "name", "cycle_id"]


class PresentPartSerializer(serializers.ModelSerializer):
    bin_id = serializers.PrimaryKeyRelatedField(queryset=Bin.objects.all())

    class Meta:
        model = PresentPart
        fields = ["present_part_id", "number", "quantity", "bin_id"]


class SystemPartSerializer(serializers.ModelSerializer):
    bin_id = serializers.PrimaryKeyRelatedField(queryset=Bin.objects.all())

    class Meta:
        model = SystemPart
        fields = ["system_part_id", "number", "quantity", "bin_id"]


class PhysicallyMissingPartSerializer(serializers.ModelSerializer):
    bin_id = serializers.PrimaryKeyRelatedField(queryset=Bin.objects.all())

    class Meta:
        model = PhysicallyMissingPart
        fields = [
            "physically_missing_part_id",
            "number",
            "quantity",
            "location",
            "date",
            "bin_id",
        ]


class SystematicallyMissingPartSerializer(serializers.ModelSerializer):
    bin_id = serializers.PrimaryKeyRelatedField(queryset=Bin.objects.all())

    class Meta:
        model = SystematicallyMissingPart
        fields = [
            "systematically_missing_part_id",
            "number",
            "quantity",
            "location",
            "date",
            "bin_id",
        ]
