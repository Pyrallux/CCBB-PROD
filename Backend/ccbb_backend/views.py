from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# REMINDER! Setup URLs for Each View


# Warehouse
@api_view(["GET", "POST", "PUT", "DELETE"])
def warehouse_list(request, format=None):
    if request.method == "GET":
        warehouse = Warehouse.objects.all()
        serializer = WarehouseSerializer(warehouse, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = WarehouseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        serializer = WarehouseSerializer(warehouse, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        warehouse = Warehouse.objects.all()
        warehouse.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "DELETE"])
def warehouse_detail(request, id, format=None):
    try:
        warehouse = Warehouse.objects.get(pk=id)
    except Warehouse.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = WarehouseSerializer(warehouse)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = WarehouseSerializer(warehouse, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        warehouse.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Transaction
@api_view(["GET", "POST", "PUT", "DELETE"])
def transaction_list(request, format=None):
    if request.method == "GET":
        transaction = Transaction.objects.all()
        serializer = TransactionSerializer(transaction, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        serializer = TransactionSerializer(transaction, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        transaction = Transaction.objects.all()
        transaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "DELETE"])
def transaction_detail(request, id, format=None):
    try:
        transaction = Transaction.objects.get(pk=id)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = TransactionSerializer(transaction, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        transaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Cycle
@api_view(["GET", "POST", "PUT", "DELETE"])
def cycle_list(request, format=None):
    if request.method == "GET":
        cycle = Cycle.objects.all()
        serializer = CycleSerializer(cycle, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = CycleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        serializer = CycleSerializer(cycle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        cycle = Cycle.objects.all()
        cycle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "DELETE"])
def cycle_detail(request, id, format=None):
    try:
        cycle = Cycle.objects.get(pk=id)
    except Cycle.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = CycleSerializer(cycle)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = CycleSerializer(cycle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        cycle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def cycle_parent(request, parent_id, format=None):
    if request.method == "GET":
        cycle = Cycle.objects.filter(warehouse_id=parent_id)
        serializer = CycleSerializer(cycle, many=True)
        return Response(serializer.data)


# PastCycle
@api_view(["GET", "POST", "PUT", "DELETE"])
def past_cycle_list(request, format=None):
    if request.method == "GET":
        past_cycle = PastCycle.objects.all()
        serializer = PastCycleSerializer(past_cycle, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = PastCycleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        serializer = PastCycleSerializer(past_cycle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        past_cycle = PastCycle.objects.all()
        past_cycle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "DELETE"])
def past_cycle_detail(request, id, format=None):
    try:
        past_cycle = PastCycle.objects.get(pk=id)
    except PastCycle.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = PastCycleSerializer(past_cycle)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = PastCycleSerializer(past_cycle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        past_cycle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def past_cycle_parent(request, parent_id, format=None):
    if request.method == "GET":
        past_cycle = PastCycle.objects.filter(warehouse_id=parent_id)
        serializer = PastCycleSerializer(past_cycle, many=True)
        return Response(serializer.data)


# Bin
@api_view(["GET", "POST", "PUT", "DELETE"])
def bin_list(request, format=None):
    if request.method == "GET":
        bin = Bin.objects.all()
        serializer = BinSerializer(bin, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = BinSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        serializer = BinSerializer(bin, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        bin = Bin.objects.all()
        bin.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "DELETE"])
def bin_detail(request, id, format=None):
    try:
        bin = Bin.objects.get(pk=id)
    except Bin.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = BinSerializer(bin)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = BinSerializer(bin, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        bin.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def bin_parent(request, parent_id, format=None):
    if request.method == "GET":
        bin = Bin.objects.filter(cycle_id=parent_id)
        serializer = BinSerializer(bin, many=True)
        return Response(serializer.data)


# PresentPart
@api_view(["GET", "POST", "PUT", "DELETE"])
def present_part_list(request, format=None):
    if request.method == "GET":
        presentPart = PresentPart.objects.all()
        serializer = PresentPartSerializer(presentPart, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = PresentPartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        serializer = PresentPartSerializer(presentPart, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        presentPart = PresentPart.objects.all()
        presentPart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "DELETE"])
def present_part_detail(request, id, format=None):
    try:
        presentPart = PresentPart.objects.get(pk=id)
    except PresentPart.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = PresentPartSerializer(presentPart)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = PresentPartSerializer(presentPart, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        presentPart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def present_part_parent(request, parent_id, format=None):
    if request.method == "GET":
        present_part = PresentPart.objects.filter(bin_id=parent_id)
        serializer = PresentPartSerializer(present_part, many=True)
        return Response(serializer.data)


# SystemPart
@api_view(["GET", "POST", "PUT", "DELETE"])
def system_part_list(request, format=None):
    if request.method == "GET":
        systemPart = SystemPart.objects.all()
        serializer = SystemPartSerializer(systemPart, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = SystemPartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        serializer = SystemPartSerializer(systemPart, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        systemPart = SystemPart.objects.all()
        systemPart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "DELETE"])
def system_part_detail(request, id, format=None):
    try:
        systemPart = SystemPart.objects.get(pk=id)
    except SystemPart.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = SystemPartSerializer(systemPart)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = SystemPartSerializer(systemPart, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        systemPart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def system_part_parent(request, parent_id, format=None):
    if request.method == "GET":
        system_part = SystemPart.objects.filter(bin_id=parent_id)
        serializer = SystemPartSerializer(system_part, many=True)
        return Response(serializer.data)


# PhysicallyMissingPart
@api_view(["GET", "POST", "PUT", "DELETE"])
def physically_missing_part_list(request, format=None):
    if request.method == "GET":
        physicallyMissingPart = PhysicallyMissingPart.objects.all()
        serializer = PhysicallyMissingPartSerializer(physicallyMissingPart, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = PhysicallyMissingPartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        serializer = PhysicallyMissingPartSerializer(
            physicallyMissingPart, data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        physicallyMissingPart = PhysicallyMissingPart.objects.all()
        physicallyMissingPart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "DELETE"])
def physically_missing_part_detail(request, id, format=None):
    try:
        physicallyMissingPart = PhysicallyMissingPart.objects.get(pk=id)
    except PhysicallyMissingPart.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = PhysicallyMissingPartSerializer(physicallyMissingPart)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = PhysicallyMissingPartSerializer(
            physicallyMissingPart, data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        physicallyMissingPart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def physically_missing_part_parent(request, parent_id, format=None):
    if request.method == "GET":
        physically_missing_part = PhysicallyMissingPart.objects.filter(bin_id=parent_id)
        serializer = PhysicallyMissingPartSerializer(physically_missing_part, many=True)
        return Response(serializer.data)


# SystematicallyMissingPart
@api_view(["GET", "POST", "PUT", "DELETE"])
def systematically_missing_part_list(request, format=None):
    if request.method == "GET":
        systematicallyMissingPart = SystematicallyMissingPart.objects.all()
        serializer = SystematicallyMissingPartSerializer(
            systematicallyMissingPart, many=True
        )
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = SystematicallyMissingPartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        serializer = SystematicallyMissingPartSerializer(
            systematicallyMissingPart, data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        systematicallyMissingPart = SystematicallyMissingPart.objects.all()
        systematicallyMissingPart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "DELETE"])
def systematically_missing_part_detail(request, id, format=None):
    try:
        systematicallyMissingPart = SystematicallyMissingPart.objects.get(pk=id)
    except SystematicallyMissingPart.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = SystematicallyMissingPartSerializer(systematicallyMissingPart)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = SystematicallyMissingPartSerializer(
            systematicallyMissingPart, data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        systematicallyMissingPart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def systematically_missing_part_parent(request, parent_id, format=None):
    if request.method == "GET":
        systematically_missing_part = SystematicallyMissingPart.objects.filter(
            bin_id=parent_id
        )
        serializer = SystematicallyMissingPartSerializer(
            systematically_missing_part, many=True
        )
        return Response(serializer.data)
