package com.inventory.cims.service;

import com.inventory.cims.dto.ItemDto;
import com.inventory.cims.entity.Item;
import com.inventory.cims.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;

    public List<ItemDto> getAllItems() {
        List<Item> items = itemRepository.findAll();
        return items.stream()
            .map(i -> modelMapper.map(i, ItemDto.class))
            .collect(Collectors.toList());
    }

    public ItemDto addItem(ItemDto itemDto) {
        Item item = modelMapper.map(itemDto, Item.class);
        item = itemRepository.save(item);
        return modelMapper.map(item, ItemDto.class);
    }

    public ItemDto updateItem(Long id, ItemDto itemDto) {
        Item item = itemRepository.findById(itemDto.getId()).orElseThrow();
        item.setName(itemDto.getName());
        item.setDescription(itemDto.getDescription());
        item.setPrice(itemDto.getPrice());
        item = itemRepository.save(item);
        return modelMapper.map(item, ItemDto.class);
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(Math.toIntExact(id));
    }
}