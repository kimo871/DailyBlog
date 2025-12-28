import { useEffect, useState } from "react";
import type { Tag } from "../../types";
import { mockTags } from "../../data/mockData";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { tagsService } from "../../api/tags";

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

export function TagInput({ selectedTags, onTagsChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
    const [tags, setTags] = useState([]);

    const fetchTags = async () => {
    try {
      const response = await tagsService.getTags();
      setTags(response?.data ?? []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTags();
  }, []);

  const availableTags = mockTags.filter(
    (tag) => !selectedTags.some((selected) => selected.id === tag.id)
  );

  const filteredSuggestions = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleAddTag = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const existingTag = mockTags.find(
        (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
      );

      if (existingTag && !selectedTags.some((t) => t.id === existingTag.id)) {
        handleAddTag(existingTag);
      } else if (!existingTag && inputValue.trim()) {
        // Create new tag
        const newTag: Tag = {
          id: `new-${Date.now()}`,
          name: inputValue.trim(),
        };
        handleAddTag(newTag);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags (press Enter to add)"
        />

        {showSuggestions && tags.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-40 overflow-auto rounded-lg border border-border bg-popover shadow-lg">
            {tags.map((tag) => (
              <Button
                key={tag?.id}
                type="button"
                variant="outline"
                className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
                onClick={() => handleAddTag(tag)}
              >
                {tag?.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="gap-1.5 px-3 py-1 rounded-full"
            >
              {tag.name}
              <Button
                variant="outline"
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {selectedTags.length === 0 && (
        <p className="text-xs text-muted-foreground">
          At least one tag is required
        </p>
      )}
    </div>
  );
}
